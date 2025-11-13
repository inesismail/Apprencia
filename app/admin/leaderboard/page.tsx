"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle, AlertCircle, Trophy, Zap, Search, Edit, Plus, Minus, Medal, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UpdateResult {
  userId: string;
  name: string;
  points: number;
  badges: string[];
}

interface UpdateResponse {
  success: boolean;
  message?: string;
  updatedCount?: number;
  results?: UpdateResult[];
  error?: string;
}

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  badges: string[];
  quizCount: number;
  certificateCount: number;
  projectCount: number;
}

export default function AdminLeaderboardPage() {
  const [loading, setLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // États pour le tableau des utilisateurs
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // États pour la gestion des badges
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [availableBadges, setAvailableBadges] = useState<string[]>([]);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [badgeAction, setBadgeAction] = useState<"add" | "remove">("add");
  const [badgeLoading, setBadgeLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAvailableBadges();
  }, []);

  useEffect(() => {
    // Recherche avec debounce
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async () => {
    console.log("🔄 [CLIENT] Récupération des utilisateurs...");
    setLoadingUsers(true);
    try {
      const url = searchQuery
        ? `/api/admin/leaderboard/users?search=${encodeURIComponent(searchQuery)}`
        : "/api/admin/leaderboard/users";

      console.log("📡 [CLIENT] URL:", url);
      const res = await fetch(url);
      const data = await res.json();

      console.log("📥 [CLIENT] Données reçues:", data);

      if (data.success) {
        console.log("✅ [CLIENT] Nombre d'utilisateurs:", data.users.length);
        if (data.users.length > 0) {
          console.log("👤 [CLIENT] Premier utilisateur:", data.users[0]);
        }
        setUsers(data.users);
      } else {
        console.error("❌ [CLIENT] Erreur dans la réponse:", data.error);
      }
    } catch (err) {
      console.error("❌ [CLIENT] Erreur lors de la récupération des utilisateurs:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAvailableBadges = async () => {
    try {
      const res = await fetch("/api/admin/leaderboard/manage-badges");
      const data = await res.json();

      if (data.success) {
        setAvailableBadges(data.badges);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des badges:", err);
    }
  };

  const handleUpdatePoints = async () => {
    setLoading(true);
    setError(null);
    setUpdateResult(null);

    try {
      const res = await fetch("/api/leaderboard/update-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setUpdateResult(data);
        await fetchUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBadge = async () => {
    if (!selectedUser || !selectedBadge) {
      console.log("❌ Utilisateur ou badge manquant", { selectedUser, selectedBadge });
      alert("Veuillez sélectionner un badge");
      return;
    }

    console.log("🚀 [CLIENT] Envoi de la requête:", {
      userId: selectedUser.id,
      action: badgeAction,
      badge: selectedBadge,
    });

    setBadgeLoading(true);
    try {
      const res = await fetch("/api/admin/leaderboard/manage-badges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: badgeAction,
          badge: selectedBadge,
        }),
      });

      console.log("📡 [CLIENT] Status de la réponse:", res.status);

      const data = await res.json();
      console.log("📥 [CLIENT] Réponse reçue:", data);

      if (data.success) {
        console.log("✅ [CLIENT] Badge géré avec succès!");
        console.log("🎖️ [CLIENT] Nouveaux badges:", data.user.badges);

        // Mettre à jour l'utilisateur dans la liste locale immédiatement
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user =>
            user.id === selectedUser.id
              ? { ...user, badges: data.user.badges }
              : user
          );
          console.log("🔄 [CLIENT] Liste locale mise à jour");
          return updatedUsers;
        });

        // Rafraîchir la liste complète depuis le serveur
        console.log("🔄 [CLIENT] Rafraîchissement depuis le serveur...");
        await fetchUsers();

        // Fermer le modal
        setBadgeModalOpen(false);
        setSelectedBadge("");

        // Afficher un message de succès
        alert(data.message || "Badge mis à jour avec succès !");
      } else {
        console.error("❌ [CLIENT] Erreur:", data.error);
        alert(data.error || "Erreur lors de la gestion du badge");
      }
    } catch (err) {
      console.error("❌ [CLIENT] Erreur de connexion:", err);
      alert("Erreur de connexion au serveur: " + (err as Error).message);
    } finally {
      setBadgeLoading(false);
    }
  };

  const openBadgeModal = (user: LeaderboardUser) => {
    setSelectedUser(user);
    setBadgeModalOpen(true);
    setSelectedBadge("");
    setBadgeAction("add");
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Gestion du Leaderboard</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Mettez à jour les points et badges de tous les utilisateurs
          </p>
        </motion.div>



        {/* Bouton de mise à jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Action
              </CardTitle>
              <CardDescription>
                Recalculer et sauvegarder les points de tous les utilisateurs dans la base de
                données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleUpdatePoints}
                disabled={loading}
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Mettre à Jour les Points
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 mt-3">
                💡 Cette action recalcule les points de tous les utilisateurs basés sur leurs quiz,
                projets et certificats, puis les sauvegarde dans MongoDB.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert className="mb-6 border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Erreur</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Résultats */}
        {updateResult && updateResult.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  Mise à Jour Réussie !
                </CardTitle>
                <CardDescription>
                  {updateResult.message} - {updateResult.updatedCount} utilisateurs mis à jour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {updateResult.results?.map((result, index) => (
                    <motion.div
                      key={result.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{result.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.badges.map((badge, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {result.badges.length === 0 && (
                            <span className="text-xs text-gray-500">Aucun badge</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">{result.points}</div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tableau des utilisateurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Classement des Utilisateurs
                  </CardTitle>
                  <CardDescription>
                    Gérez les points et badges de tous les utilisateurs
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  Total: <span className="font-bold text-primary">{users.length}</span> utilisateurs
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                    >
                      {/* Rang */}
                      <div className="flex-shrink-0 w-16 flex items-center justify-center">
                        {getRankIcon(user.rank)}
                      </div>

                      {/* Infos utilisateur */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span>📝 {user.quizCount} quiz</span>
                          <span>🎯 {user.projectCount} projets</span>
                          <span>🎓 {user.certificateCount} certificats</span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{user.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>

                      {/* Badges */}
                      <div className="flex-shrink-0 w-48">
                        <div className="flex flex-wrap gap-1">
                          {user.badges.length > 0 ? (
                            user.badges.slice(0, 3).map((badge, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">Aucun badge</span>
                          )}
                          {user.badges.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.badges.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBadgeModal(user)}
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Badges
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Modal de gestion des badges */}
        <Dialog open={badgeModalOpen} onOpenChange={setBadgeModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Gérer les Badges</DialogTitle>
              <DialogDescription>
                {selectedUser && `${selectedUser.name} - ${selectedUser.points} points`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Badges actuels */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Badges actuels:
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                  {selectedUser?.badges.length ? (
                    selectedUser.badges.map((badge, idx) => (
                      <Badge key={idx} variant="secondary">
                        {badge}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Aucun badge</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Action:
                </label>
                <Select value={badgeAction} onValueChange={(value: "add" | "remove") => setBadgeAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter un badge
                      </div>
                    </SelectItem>
                    <SelectItem value="remove">
                      <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4" />
                        Retirer un badge
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection du badge */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Badge:
                </label>
                <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un badge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBadges.map((badge) => (
                      <SelectItem key={badge} value={badge}>
                        {badge}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Boutons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setBadgeModalOpen(false)}
                  className="flex-1"
                  disabled={badgeLoading}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleManageBadge}
                  className="flex-1"
                  disabled={!selectedBadge || badgeLoading}
                >
                  {badgeLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      En cours...
                    </>
                  ) : (
                    <>
                      {badgeAction === "add" ? <Plus className="w-4 h-4 mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
                      {badgeAction === "add" ? "Ajouter" : "Retirer"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


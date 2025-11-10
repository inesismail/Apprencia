"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Database, CheckCircle, AlertCircle, Trophy, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface StatusResponse {
  success: boolean;
  totalUsers: number;
  usersWithPoints: number;
  needsUpdate: boolean;
}

export default function AdminLeaderboardPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [updateResult, setUpdateResult] = useState<UpdateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/leaderboard/update-points");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Erreur lors de la récupération du statut:", err);
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
        // Rafraîchir le statut
        await fetchStatus();
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

        {/* Statut */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Statut de la Base de Données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Utilisateurs</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {status.totalUsers}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Avec Points</div>
                    <div className="text-3xl font-bold text-green-600">
                      {status.usersWithPoints}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">À Mettre à Jour</div>
                    <div className="text-3xl font-bold text-amber-600">
                      {status.totalUsers - status.usersWithPoints}
                    </div>
                  </div>
                </div>

                {status.needsUpdate && (
                  <Alert className="mt-4 border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Mise à jour nécessaire</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Certains utilisateurs n'ont pas encore de points calculés. Cliquez sur le
                      bouton ci-dessous pour mettre à jour.
                    </AlertDescription>
                  </Alert>
                )}

                {!status.needsUpdate && status.usersWithPoints > 0 && (
                  <Alert className="mt-4 border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Tout est à jour !</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Tous les utilisateurs ont leurs points calculés et sauvegardés.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

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
            <Card className="bg-white shadow-lg">
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
      </div>
    </div>
  );
}


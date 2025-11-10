"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, Filter, Calendar, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUser {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  quizPoints: number;
  projectPoints: number;
  formationPoints: number;
  badges: string[];
  completedProjects: number;
  passedQuizzes: number;
  certificates: number;
  rank: number;
  avatar: string | null;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [category, setCategory] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);

  // Récupérer l'ID de l'utilisateur connecté depuis localStorage
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUserId(userData._id);
      } catch (err) {
        console.error("Erreur parsing user dans localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLeaderboard();
    }
  }, [period, category, userId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = userId
        ? `/api/leaderboard?period=${period}&category=${category}&userId=${userId}`
        : `/api/leaderboard?period=${period}&category=${category}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setCurrentUserRank(data.currentUserRank || null);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-600" />;
    return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 via-yellow-500 to-amber-500";
    if (rank === 2) return "from-gray-300 via-gray-400 to-gray-500";
    if (rank === 3) return "from-amber-500 via-amber-600 to-orange-600";
    return "from-teal-50 to-cyan-50";
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Classement & Leaderboard</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Découvrez les meilleurs apprenants de la plateforme
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Filtres</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Filtre période */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout le temps</SelectItem>
                    <SelectItem value="monthly">Ce mois</SelectItem>
                    <SelectItem value="weekly">Cette semaine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre catégorie */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="projects">Projets</SelectItem>
                    <SelectItem value="formations">Formations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Votre Classement */}
        {!loading && currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  Votre Classement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  {/* Rang */}
                  <div className="flex-shrink-0 w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">#{currentUserRank.rank}</span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-16 h-16 border-4 border-primary">
                    <AvatarImage src={currentUserRank.avatar || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                      {getInitials(currentUserRank.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info utilisateur */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">{currentUserRank.name}</h3>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{currentUserRank.totalPoints} points</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        📚 {currentUserRank.passedQuizzes} quiz
                      </span>
                      <span className="text-sm text-gray-600">
                        💼 {currentUserRank.completedProjects} projets
                      </span>
                      <span className="text-sm text-gray-600">
                        🎖️ {currentUserRank.certificates} certificats
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  {currentUserRank.badges.length > 0 && (
                    <div className="hidden lg:flex flex-wrap gap-2 max-w-[300px]">
                      {currentUserRank.badges.slice(0, 3).map((badge, idx) => (
                        <Badge key={idx} variant="default" className="text-xs bg-primary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message d'encouragement */}
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-gray-700">
                    {currentUserRank.rank === 1 && "🏆 Félicitations ! Vous êtes en tête du classement !"}
                    {currentUserRank.rank === 2 && "🥈 Excellent ! Encore un petit effort pour atteindre la première place !"}
                    {currentUserRank.rank === 3 && "🥉 Très bien ! Vous êtes sur le podium !"}
                    {currentUserRank.rank > 3 && currentUserRank.rank <= 10 && "⭐ Vous êtes dans le top 10 ! Continuez comme ça !"}
                    {currentUserRank.rank > 10 && currentUserRank.rank <= 50 && "💪 Bon travail ! Continuez à progresser pour atteindre le top 10 !"}
                    {currentUserRank.rank > 50 && "🚀 Continuez à apprendre et à compléter des projets pour grimper dans le classement !"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Podium Top 3 */}
        {!loading && leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 2ème place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:order-1 order-2"
              >
                <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-400 shadow-xl">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <Medal className="w-16 h-16 text-gray-500" />
                    </div>
                    <CardTitle className="text-xl">2ème Place</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-gray-400">
                      <AvatarImage src={leaderboard[1].avatar || undefined} />
                      <AvatarFallback className="bg-gray-300 text-gray-700 text-xl">
                        {getInitials(leaderboard[1].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{leaderboard[1].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-700">
                        {leaderboard[1].totalPoints} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {leaderboard[1].badges.slice(0, 2).map((badge, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 1ère place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:order-2 order-1"
              >
                <Card className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 border-4 border-yellow-500 shadow-2xl transform md:scale-110">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <Trophy className="w-20 h-20 text-yellow-600 animate-bounce" />
                    </div>
                    <CardTitle className="text-2xl font-bold">🏆 Champion 🏆</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-3 border-4 border-yellow-600">
                      <AvatarImage src={leaderboard[0].avatar || undefined} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-800 text-2xl">
                        {getInitials(leaderboard[0].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl mb-1">{leaderboard[0].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-6 h-6 text-yellow-700" />
                      <span className="text-3xl font-bold text-yellow-800">
                        {leaderboard[0].totalPoints} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {leaderboard[0].badges.slice(0, 3).map((badge, idx) => (
                        <Badge key={idx} variant="default" className="text-xs bg-yellow-700">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 3ème place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="md:order-3 order-3"
              >
                <Card className="bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-500 shadow-xl">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <Award className="w-16 h-16 text-amber-700" />
                    </div>
                    <CardTitle className="text-xl">3ème Place</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-amber-600">
                      <AvatarImage src={leaderboard[2].avatar || undefined} />
                      <AvatarFallback className="bg-amber-200 text-amber-800 text-xl">
                        {getInitials(leaderboard[2].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{leaderboard[2].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-amber-700">
                        {leaderboard[2].totalPoints} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {leaderboard[2].badges.slice(0, 2).map((badge, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Liste complète */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Classement Complet</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement du classement...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Aucun utilisateur dans le classement pour cette période.
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {leaderboard.map((user, index) => {
                      const isCurrentUser = userId && String(user.userId) === String(userId);
                      return (
                      <motion.div
                        key={user.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                          user.rank <= 3
                            ? `bg-gradient-to-r ${getRankBgColor(user.rank)} border-transparent text-white`
                            : isCurrentUser
                            ? "bg-primary/5 border-primary shadow-md"
                            : "bg-white border-gray-200 hover:border-primary"
                        }`}
                      >
                        {/* Rang */}
                        <div className="flex-shrink-0 w-16 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="w-12 h-12 border-2 border-white">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Info utilisateur */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-lg truncate flex items-center gap-2 ${user.rank <= 3 ? "text-white" : "text-gray-900"}`}>
                            {user.name}
                            {isCurrentUser && (
                              <Badge variant="default" className="text-xs bg-primary">
                                Vous
                              </Badge>
                            )}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-sm ${user.rank <= 3 ? "text-white/90" : "text-gray-600"}`}>
                              📚 {user.passedQuizzes} quiz
                            </span>
                            <span className={`text-sm ${user.rank <= 3 ? "text-white/90" : "text-gray-600"}`}>
                              💼 {user.completedProjects} projets
                            </span>
                            <span className={`text-sm ${user.rank <= 3 ? "text-white/90" : "text-gray-600"}`}>
                              🎖️ {user.certificates} certificats
                            </span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right flex-shrink-0">
                          <div className={`text-2xl font-bold ${user.rank <= 3 ? "text-white" : "text-primary"}`}>
                            {user.totalPoints}
                          </div>
                          <div className={`text-sm ${user.rank <= 3 ? "text-white/80" : "text-gray-500"}`}>
                            points
                          </div>
                        </div>

                        {/* Badges */}
                        {user.badges.length > 0 && (
                          <div className="hidden lg:flex flex-col gap-1 flex-shrink-0 max-w-[200px]">
                            {user.badges.slice(0, 2).map((badge, idx) => (
                              <Badge
                                key={idx}
                                variant={user.rank <= 3 ? "secondary" : "outline"}
                                className="text-xs truncate"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


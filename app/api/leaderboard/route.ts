import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import Project from "@/models/Project";
import Quiz from "@/models/Quiz";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "all"; // all, weekly, monthly
    const category = searchParams.get("category") || "all"; // all, formations, quiz, projects
    const currentUserId = searchParams.get("userId"); // ID de l'utilisateur connecté

    // Calculer la date de début selon la période
    let startDate: Date | null = null;
    const now = new Date();

    if (period === "weekly") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "monthly") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Récupérer tous les utilisateurs avec leurs données
    const users = await User.find({ role: "user", isApproved: true })
      .populate("certificates")
      .populate("projectsTaken")
      .lean();

    const projects = await Project.find().lean();
    const quizzes = await Quiz.find().lean();

    // Calculer les points pour chaque utilisateur
    const leaderboardData = users.map((user: any) => {
      let totalPoints = 0;
      let quizPoints = 0;
      let projectPoints = 0;
      let formationPoints = 0;
      const badges: string[] = [];

      // 🎯 Points pour les quiz
      if (user.quizzes && Array.isArray(user.quizzes)) {
        user.quizzes.forEach((quizResult: any) => {
          // Filtrer par période si nécessaire
          if (startDate && new Date(quizResult.date) < startDate) return;

          const quiz = quizzes.find((q: any) => String(q._id) === String(quizResult.quiz));
          const passingScore = quiz?.passingScore || 50;

          if (quizResult.score >= passingScore) {
            // Points basés sur le score et la difficulté
            let points = quizResult.score;
            if (quiz?.difficulty === "difficile") points *= 1.5;
            else if (quiz?.difficulty === "moyen") points *= 1.2;

            quizPoints += Math.round(points);
          }
        });
      }

      // 🎯 Points pour les projets
      const userProjects = projects.filter(
        (p: any) => String(p.takenBy) === String(user._id)
      );

      userProjects.forEach((project: any) => {
        // Filtrer par période si nécessaire
        if (startDate && project.takenAt && new Date(project.takenAt) < startDate) return;

        if (project.status === "terminé") {
          let points = 100;
          if (project.difficulty === "Advanced") points = 200;
          else if (project.difficulty === "Intermediate") points = 150;

          projectPoints += points;
        } else if (project.status === "en cours") {
          projectPoints += 25; // Points pour avoir commencé
        }
      });

      // 🎯 Points pour les certificats (formations)
      if (user.certificates && Array.isArray(user.certificates)) {
        const certificatesInPeriod = startDate
          ? user.certificates.filter((cert: any) => new Date(cert.date) >= startDate)
          : user.certificates;

        formationPoints = certificatesInPeriod.length * 150;
      }

      // Calculer le total selon la catégorie
      if (category === "quiz") {
        totalPoints = quizPoints;
      } else if (category === "projects") {
        totalPoints = projectPoints;
      } else if (category === "formations") {
        totalPoints = formationPoints;
      } else {
        totalPoints = quizPoints + projectPoints + formationPoints;
      }

      // 🏆 Attribution des badges
      const completedProjects = userProjects.filter((p: any) => p.status === "terminé").length;
      const passedQuizzes = user.quizzes?.filter((q: any) => {
        const quiz = quizzes.find((qz: any) => String(qz._id) === String(q.quiz));
        return q.score >= (quiz?.passingScore || 50);
      }).length || 0;

      if (completedProjects >= 10) badges.push("🏆 Master des Projets");
      else if (completedProjects >= 5) badges.push("⭐ Expert Projet");
      else if (completedProjects >= 1) badges.push("🌟 Débutant Projet");

      if (passedQuizzes >= 20) badges.push("🎓 Génie des Quiz");
      else if (passedQuizzes >= 10) badges.push("📚 Expert Quiz");
      else if (passedQuizzes >= 5) badges.push("📖 Amateur Quiz");

      if (user.certificates?.length >= 5) badges.push("🎖️ Collectionneur de Certificats");
      if (totalPoints >= 5000) badges.push("💎 Légende");
      else if (totalPoints >= 2000) badges.push("🔥 Champion");

      return {
        userId: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur",
        email: user.email,
        totalPoints,
        quizPoints,
        projectPoints,
        formationPoints,
        badges,
        completedProjects,
        passedQuizzes,
        certificates: user.certificates?.length || 0,
        avatar: user.cvUrl || null,
      };
    });

    // Trier par points décroissants
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

    // Ajouter le rang
    const rankedData = leaderboardData.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Trouver le classement de l'utilisateur connecté
    let currentUserRank = null;
    if (currentUserId) {
      const userIndex = rankedData.findIndex((user) => String(user.userId) === String(currentUserId));
      if (userIndex !== -1) {
        currentUserRank = rankedData[userIndex];
      }
    }

    return NextResponse.json({
      success: true,
      leaderboard: rankedData,
      currentUserRank, // Classement de l'utilisateur connecté
      period,
      category,
    });
  } catch (error) {
    console.error("Erreur dans /api/leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération du classement" },
      { status: 500 }
    );
  }
}


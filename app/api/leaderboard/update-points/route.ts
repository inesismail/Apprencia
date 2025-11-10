import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import Project from "@/models/Project";
import Quiz from "@/models/Quiz";

/**
 * API Route pour mettre à jour les points et badges de tous les utilisateurs
 * POST /api/leaderboard/update-points
 * 
 * Cette route calcule et sauvegarde les points dans la base de données
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Vérifier que c'est un admin qui fait la requête (optionnel)
    // const { role } = await req.json();
    // if (role !== "admin") {
    //   return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    // }

    // Récupérer tous les utilisateurs
    const users = await User.find({ role: "user", isApproved: true })
      .populate("certificates")
      .populate("projectsTaken");

    const projects = await Project.find().lean();
    const quizzes = await Quiz.find().lean();

    let updatedCount = 0;
    const updateResults = [];

    // Calculer et sauvegarder les points pour chaque utilisateur
    for (const user of users) {
      let totalPoints = 0;
      let quizPoints = 0;
      let projectPoints = 0;
      let formationPoints = 0;
      const badges: string[] = [];

      // 🎯 Calcul des points quiz
      if (user.quizzes && Array.isArray(user.quizzes)) {
        user.quizzes.forEach((quizResult: any) => {
          const quiz = quizzes.find((q: any) => String(q._id) === String(quizResult.quiz));
          const passingScore = quiz?.passingScore || 50;

          if (quizResult.score >= passingScore) {
            let points = quizResult.score;
            if (quiz?.difficulty === "difficile") points *= 1.5;
            else if (quiz?.difficulty === "moyen") points *= 1.2;

            quizPoints += Math.round(points);
          }
        });
      }

      // 🎯 Calcul des points projets
      const userProjects = projects.filter(
        (p: any) => String(p.takenBy) === String(user._id)
      );

      userProjects.forEach((project: any) => {
        if (project.status === "terminé") {
          let points = 100;
          if (project.difficulty === "Advanced") points = 200;
          else if (project.difficulty === "Intermediate") points = 150;

          projectPoints += points;
        } else if (project.status === "en cours") {
          projectPoints += 25;
        }
      });

      // 🎯 Calcul des points formations
      if (user.certificates && Array.isArray(user.certificates)) {
        formationPoints = user.certificates.length * 150;
      }

      // Total
      totalPoints = quizPoints + projectPoints + formationPoints;

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

      // 💾 Sauvegarder dans la base de données
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            points: totalPoints,
            badges: badges,
          },
        },
        { new: true }
      );

      updatedCount++;
      updateResults.push({
        userId: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur",
        points: totalPoints,
        badges: badges,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Points mis à jour pour ${updatedCount} utilisateurs`,
      updatedCount,
      results: updateResults,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des points:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour des points" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leaderboard/update-points
 * Retourne le statut de la dernière mise à jour
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Compter les utilisateurs avec des points
    const usersWithPoints = await User.countDocuments({
      role: "user",
      isApproved: true,
      points: { $gt: 0 },
    });

    const totalUsers = await User.countDocuments({
      role: "user",
      isApproved: true,
    });

    return NextResponse.json({
      success: true,
      totalUsers,
      usersWithPoints,
      needsUpdate: usersWithPoints < totalUsers,
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}


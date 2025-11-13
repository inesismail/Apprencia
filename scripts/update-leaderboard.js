/**
 * 🔄 Script de mise à jour automatique du classement
 * 
 * Ce script met à jour le classement de tous les utilisateurs dans la base de données
 * pour toutes les combinaisons de période et catégorie.
 * 
 * Usage:
 *   node scripts/update-leaderboard.js
 * 
 * À exécuter périodiquement (ex: toutes les heures via cron job)
 */

const mongoose = require("mongoose");

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mondb";

// Schémas
const QuizResultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: Number,
  date: Date,
  title: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
  isApproved: Boolean,
  quizzes: [QuizResultSchema],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  projectsTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  badges: [String],
  leaderboardStats: {
    globalRank: Number,
    globalPoints: Number,
    quizRank: Number,
    quizPoints: Number,
    projectRank: Number,
    projectPoints: Number,
    formationRank: Number,
    formationPoints: Number,
    weeklyRank: Number,
    weeklyPoints: Number,
    monthlyRank: Number,
    monthlyPoints: Number,
    lastUpdated: Date,
  },
});

const projectSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  status: String,
  takenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  takenAt: Date,
});

const quizSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  passingScore: Number,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

/**
 * Calcule les points pour une combinaison période/catégorie
 */
async function calculateLeaderboard(period, category) {
  console.log(`\n📊 Calcul du classement: ${period} / ${category}`);

  // Calculer la date de début selon la période
  let startDate = null;
  const now = new Date();

  if (period === "weekly") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "monthly") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Récupérer tous les utilisateurs
  const users = await User.find({ role: "user", isApproved: true }).lean();
  const projects = await Project.find().lean();
  const quizzes = await Quiz.find().lean();

  // Calculer les points pour chaque utilisateur
  const leaderboardData = users.map((user) => {
    let quizPoints = 0;
    let projectPoints = 0;
    let formationPoints = 0;

    // Points pour les quiz
    if (user.quizzes && Array.isArray(user.quizzes)) {
      user.quizzes.forEach((quizResult) => {
        if (startDate && new Date(quizResult.date) < startDate) return;

        const quiz = quizzes.find((q) => String(q._id) === String(quizResult.quiz));
        const passingScore = quiz?.passingScore || 50;

        if (quizResult.score >= passingScore) {
          let points = quizResult.score;
          if (quiz?.difficulty === "difficile") points *= 1.5;
          else if (quiz?.difficulty === "moyen") points *= 1.2;
          quizPoints += Math.round(points);
        }
      });
    }

    // Points pour les projets
    const userProjects = projects.filter((p) => String(p.takenBy) === String(user._id));
    userProjects.forEach((project) => {
      if (startDate && project.takenAt && new Date(project.takenAt) < startDate) return;

      if (project.status === "terminé") {
        let points = 100;
        if (project.difficulty === "Advanced") points = 200;
        else if (project.difficulty === "Intermediate") points = 150;
        projectPoints += points;
      } else if (project.status === "en cours") {
        projectPoints += 25;
      }
    });

    // Points pour les certificats
    if (user.certificates && Array.isArray(user.certificates)) {
      formationPoints = user.certificates.length * 150;
    }

    // Calculer le total selon la catégorie
    let totalPoints = 0;
    if (category === "quiz") {
      totalPoints = quizPoints;
    } else if (category === "projects") {
      totalPoints = projectPoints;
    } else if (category === "formations") {
      totalPoints = formationPoints;
    } else {
      totalPoints = quizPoints + projectPoints + formationPoints;
    }

    return {
      userId: user._id,
      totalPoints,
      quizPoints,
      projectPoints,
      formationPoints,
    };
  });

  // Trier par points décroissants
  leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

  // Mettre à jour la base de données
  for (let i = 0; i < leaderboardData.length; i++) {
    const userData = leaderboardData[i];
    const rank = i + 1;

    const updateFields = {
      "leaderboardStats.lastUpdated": new Date(),
    };

    // Mise à jour selon la catégorie
    if (category === "all") {
      updateFields["leaderboardStats.globalRank"] = rank;
      updateFields["leaderboardStats.globalPoints"] = userData.totalPoints;
    } else if (category === "quiz") {
      updateFields["leaderboardStats.quizRank"] = rank;
      updateFields["leaderboardStats.quizPoints"] = userData.totalPoints;
    } else if (category === "projects") {
      updateFields["leaderboardStats.projectRank"] = rank;
      updateFields["leaderboardStats.projectPoints"] = userData.totalPoints;
    } else if (category === "formations") {
      updateFields["leaderboardStats.formationRank"] = rank;
      updateFields["leaderboardStats.formationPoints"] = userData.totalPoints;
    }

    // Mise à jour selon la période
    if (period === "weekly") {
      updateFields["leaderboardStats.weeklyRank"] = rank;
      updateFields["leaderboardStats.weeklyPoints"] = userData.totalPoints;
    } else if (period === "monthly") {
      updateFields["leaderboardStats.monthlyRank"] = rank;
      updateFields["leaderboardStats.monthlyPoints"] = userData.totalPoints;
    }

    await User.findByIdAndUpdate(userData.userId, { $set: updateFields });
  }

  console.log(`✅ ${leaderboardData.length} utilisateurs mis à jour`);
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log("🚀 Démarrage de la mise à jour du classement...");
    console.log(`📡 Connexion à MongoDB: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Mettre à jour toutes les combinaisons
    const periods = ["all", "weekly", "monthly"];
    const categories = ["all", "quiz", "projects", "formations"];

    for (const period of periods) {
      for (const category of categories) {
        await calculateLeaderboard(period, category);
      }
    }

    console.log("\n🎉 Mise à jour du classement terminée avec succès !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Déconnecté de MongoDB");
  }
}

// Exécuter le script
main();


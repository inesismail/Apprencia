/**
 * Script pour mettre à jour les points du leaderboard
 * 
 * Usage:
 *   node scripts/update-leaderboard-points.js
 * 
 * Ce script peut être exécuté:
 * - Manuellement
 * - Via un cron job (ex: chaque nuit à 2h du matin)
 * - Via un webhook après certaines actions
 */

const mongoose = require('mongoose');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apprencia';

// Schémas simplifiés (copie des modèles)
const QuizResultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: Number,
  date: Date,
  title: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  quizzes: [QuizResultSchema],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  projectsTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  isApproved: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
}, { timestamps: true });

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

// Modèles
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

async function updateLeaderboardPoints() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les utilisateurs
    console.log('📊 Récupération des utilisateurs...');
    const users = await User.find({ role: "user", isApproved: true })
      .populate("certificates")
      .populate("projectsTaken");

    const projects = await Project.find().lean();
    const quizzes = await Quiz.find().lean();

    console.log(`👥 ${users.length} utilisateurs trouvés\n`);

    let updatedCount = 0;

    // Calculer et sauvegarder les points pour chaque utilisateur
    for (const user of users) {
      let totalPoints = 0;
      let quizPoints = 0;
      let projectPoints = 0;
      let formationPoints = 0;
      const badges = [];

      // 🎯 Calcul des points quiz
      if (user.quizzes && Array.isArray(user.quizzes)) {
        user.quizzes.forEach((quizResult) => {
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

      // 🎯 Calcul des points projets
      const userProjects = projects.filter(
        (p) => String(p.takenBy) === String(user._id)
      );

      userProjects.forEach((project) => {
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
      const completedProjects = userProjects.filter((p) => p.status === "terminé").length;
      const passedQuizzes = user.quizzes?.filter((q) => {
        const quiz = quizzes.find((qz) => String(qz._id) === String(q.quiz));
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
      
      const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur";
      console.log(`✅ ${userName}: ${totalPoints} points, ${badges.length} badges`);
    }

    console.log(`\n🎉 Mise à jour terminée ! ${updatedCount} utilisateurs mis à jour`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Déconnecté de MongoDB');
    process.exit(0);
  }
}

// Exécuter le script
updateLeaderboardPoints();


/**
 * Script pour corriger les temps des quiz existants
 * Calcule automatiquement un temps logique basé sur le nombre de questions et la difficulté
 * 
 * Usage: node scripts/fix-quiz-time-limits.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apprencia';

// Schéma Quiz simplifié
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
  timeLimit: Number,
  passingScore: Number,
  category: String,
  difficulty: { type: String, enum: ["facile", "moyen", "difficile"], default: "facile" },
  createdAt: Date,
  updatedAt: Date,
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

/**
 * Calcule le temps recommandé pour un quiz
 * @param {number} numQuestions - Nombre de questions
 * @param {string} difficulty - Difficulté (facile, moyen, difficile)
 * @returns {number} Temps en minutes
 */
function calculateRecommendedTime(numQuestions, difficulty) {
  let timePerQuestion = 2; // minutes par question par défaut
  
  // Ajuster selon la difficulté
  if (difficulty === "facile") {
    timePerQuestion = 1.5; // 1.5 min par question
  } else if (difficulty === "moyen") {
    timePerQuestion = 2; // 2 min par question
  } else if (difficulty === "difficile") {
    timePerQuestion = 3; // 3 min par question
  }
  
  return Math.ceil(numQuestions * timePerQuestion);
}

async function fixQuizTimeLimits() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les quiz
    console.log('📊 Récupération des quiz...');
    const quizzes = await Quiz.find({});
    console.log(`✅ ${quizzes.length} quiz trouvés\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const quiz of quizzes) {
      const numQuestions = quiz.questions?.length || 0;
      const difficulty = quiz.difficulty || 'moyen';
      const currentTimeLimit = quiz.timeLimit || 0;
      
      // Calculer le temps recommandé
      const recommendedTime = calculateRecommendedTime(numQuestions, difficulty);
      
      console.log(`\n📝 Quiz: "${quiz.title}"`);
      console.log(`   Questions: ${numQuestions}`);
      console.log(`   Difficulté: ${difficulty}`);
      console.log(`   Temps actuel: ${currentTimeLimit} min`);
      console.log(`   Temps recommandé: ${recommendedTime} min`);
      
      // Vérifier si le temps actuel est illogique
      const isIllogical = currentTimeLimit > numQuestions * 5 || currentTimeLimit < numQuestions * 0.5;
      
      if (isIllogical || currentTimeLimit === 0) {
        // Mettre à jour le temps
        quiz.timeLimit = recommendedTime;
        quiz.updatedAt = new Date();
        await quiz.save();
        
        console.log(`   ✅ Temps mis à jour: ${currentTimeLimit} → ${recommendedTime} min`);
        updatedCount++;
      } else {
        console.log(`   ⏭️  Temps déjà logique, pas de modification`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`✅ Quiz mis à jour: ${updatedCount}`);
    console.log(`⏭️  Quiz ignorés (temps déjà logique): ${skippedCount}`);
    console.log(`📝 Total: ${quizzes.length}`);
    console.log('='.repeat(60));

    console.log('\n✅ Script terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter le script
fixQuizTimeLimits();


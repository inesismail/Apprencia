import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: Number,
  date: Date,
  title: String,
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: String,
    birthDate: Date,
    firstName: String,
    lastName: String,
    address: String,
    cvUrl: String,
    cvText: { type: String, default: "" },
    skills: { type: [String], default: [] },
    quizzes: [QuizResultSchema],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    projectsTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
    resetToken: { type: String, select: false },
    resetTokenExpire: { type: Date, select: false },
    lastLogin: { type: Date, default: Date.now },

    // ➕ nouveau champ
    isApproved: { type: Boolean, default: false },

    // 🏆 Système de points pour le leaderboard
    points: { type: Number, default: 0 },
    badges: [{ type: String }], // Badges obtenus par l'utilisateur

    // 📊 Classement détaillé par catégorie et période
    leaderboardStats: {
      // Classement global
      globalRank: { type: Number, default: null },
      globalPoints: { type: Number, default: 0 },

      // Classement par catégorie
      quizRank: { type: Number, default: null },
      quizPoints: { type: Number, default: 0 },
      projectRank: { type: Number, default: null },
      projectPoints: { type: Number, default: 0 },
      formationRank: { type: Number, default: null },
      formationPoints: { type: Number, default: 0 },

      // Classement par période
      weeklyRank: { type: Number, default: null },
      weeklyPoints: { type: Number, default: 0 },
      monthlyRank: { type: Number, default: null },
      monthlyPoints: { type: Number, default: 0 },

      // Date de dernière mise à jour
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);


// Middleware de hashage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    console.log("Mot de passe non modifié, pas de hashage");
    return next();
  }

  console.log("Hashage du mot de passe avant sauvegarde...");
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);

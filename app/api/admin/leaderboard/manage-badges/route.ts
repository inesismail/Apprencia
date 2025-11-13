import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

/**
 * API Route pour gérer les badges des utilisateurs
 * POST /api/admin/leaderboard/manage-badges
 * 
 * Body: {
 *   userId: string,
 *   action: "add" | "remove",
 *   badge: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    console.log("🔧 [API] Début de la requête manage-badges");
    await dbConnect();
    console.log("✅ [API] Connexion DB établie");

    const body = await req.json();
    const { userId, action, badge } = body;

    console.log("🔧 [API] Requête reçue:", { userId, action, badge });

    // Validation des paramètres
    if (!userId || !action || !badge) {
      console.error("❌ [API] Paramètres manquants");
      return NextResponse.json(
        { success: false, error: "Paramètres manquants (userId, action, badge)" },
        { status: 400 }
      );
    }

    if (action !== "add" && action !== "remove") {
      console.error("❌ [API] Action invalide:", action);
      return NextResponse.json(
        { success: false, error: "Action invalide. Utilisez 'add' ou 'remove'" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    console.log("🔍 [API] Recherche de l'utilisateur:", userId);
    const user = await User.findById(userId);
    console.log("👤 [API] Utilisateur trouvé:", user ? `${user.firstName} ${user.lastName} (${user.email})` : "Non trouvé");

    if (!user) {
      console.error("❌ [API] Utilisateur non trouvé:", userId);
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Initialiser badges si nécessaire
    if (!user.badges) {
      console.log("⚠️ [API] Initialisation du tableau badges");
      user.badges = [];
    }

    console.log("🎖️ [API] Badges actuels:", user.badges);

    if (action === "add") {
      // Vérifier si le badge existe déjà
      if (user.badges.includes(badge)) {
        console.log("⚠️ [API] Badge déjà présent");
        return NextResponse.json(
          { success: false, error: "Ce badge existe déjà pour cet utilisateur" },
          { status: 400 }
        );
      }

      console.log("➕ [API] Ajout du badge:", badge);

      // Utiliser updateOne avec $addToSet pour éviter les doublons
      const updateResult = await User.updateOne(
        { _id: userId },
        { $addToSet: { badges: badge } }
      );

      console.log("📝 [API] Résultat de la mise à jour:", updateResult);

      // Récupérer l'utilisateur mis à jour
      const verifyUser = await User.findById(userId).select("badges firstName lastName email points");
      console.log("🔍 [API] Vérification dans la DB:", verifyUser?.badges);

      if (!verifyUser) {
        throw new Error("Impossible de récupérer l'utilisateur après la mise à jour");
      }

      return NextResponse.json({
        success: true,
        message: `Badge "${badge}" ajouté avec succès`,
        user: {
          id: verifyUser._id.toString(),
          name: `${verifyUser.firstName || ""} ${verifyUser.lastName || ""}`.trim() || verifyUser.email,
          email: verifyUser.email,
          badges: verifyUser.badges,
          points: verifyUser.points,
        },
      });
    } else {
      // Retirer le badge
      if (!user.badges.includes(badge)) {
        console.log("⚠️ [API] Badge non trouvé dans la liste");
        return NextResponse.json(
          { success: false, error: "Ce badge n'existe pas pour cet utilisateur" },
          { status: 400 }
        );
      }

      console.log("➖ [API] Retrait du badge:", badge);

      // Utiliser updateOne avec $pull
      const updateResult = await User.updateOne(
        { _id: userId },
        { $pull: { badges: badge } }
      );

      console.log("📝 [API] Résultat de la mise à jour:", updateResult);

      // Récupérer l'utilisateur mis à jour
      const verifyUser = await User.findById(userId).select("badges firstName lastName email points");
      console.log("🔍 [API] Vérification dans la DB:", verifyUser?.badges);

      if (!verifyUser) {
        throw new Error("Impossible de récupérer l'utilisateur après la mise à jour");
      }

      return NextResponse.json({
        success: true,
        message: `Badge "${badge}" retiré avec succès`,
        user: {
          id: verifyUser._id.toString(),
          name: `${verifyUser.firstName || ""} ${verifyUser.lastName || ""}`.trim() || verifyUser.email,
          email: verifyUser.email,
          badges: verifyUser.badges,
          points: verifyUser.points,
        },
      });
    }
  } catch (error: any) {
    console.error("❌❌❌ [API] Erreur dans /api/admin/leaderboard/manage-badges:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { success: false, error: "Erreur serveur: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/leaderboard/manage-badges
 * Retourne la liste des badges disponibles dans le système
 */
export async function GET() {
  try {
    await dbConnect();

    // Liste des badges standards du système
    const standardBadges = [
      "🏆 Master des Projets",
      "⭐ Expert Projet",
      "🌟 Débutant Projet",
      "🎓 Génie des Quiz",
      "📚 Expert Quiz",
      "📖 Amateur Quiz",
      "🎖️ Collectionneur de Certificats",
      "💎 Légende",
      "🔥 Champion",
    ];

    // Récupérer tous les badges uniques utilisés dans la base de données
    const allUsers = await User.find({ badges: { $exists: true, $ne: [] } }).select("badges");
    const usedBadges = new Set<string>();
    
    allUsers.forEach((user) => {
      user.badges?.forEach((badge: string) => usedBadges.add(badge));
    });

    // Combiner les badges standards et ceux utilisés
    const allBadges = Array.from(new Set([...standardBadges, ...Array.from(usedBadges)]));

    return NextResponse.json({
      success: true,
      badges: allBadges,
      standardBadges,
      customBadges: Array.from(usedBadges).filter((b) => !standardBadges.includes(b)),
    });
  } catch (error: any) {
    console.error("Erreur dans GET /api/admin/leaderboard/manage-badges:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur: " + error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/User";

/**
 * GET /api/leaderboard/user/[id]
 * Récupère le classement d'un utilisateur spécifique depuis la base de données
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec ses stats de classement
    const user = await User.findById(userId)
      .select("firstName lastName email leaderboardStats badges points")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur",
        email: user.email,
        badges: user.badges || [],
        points: user.points || 0,
        leaderboardStats: user.leaderboardStats || {
          globalRank: null,
          globalPoints: 0,
          quizRank: null,
          quizPoints: 0,
          projectRank: null,
          projectPoints: 0,
          formationRank: null,
          formationPoints: 0,
          weeklyRank: null,
          weeklyPoints: 0,
          monthlyRank: null,
          monthlyPoints: 0,
          lastUpdated: null,
        },
      },
    });
  } catch (error) {
    console.error("Erreur dans /api/leaderboard/user/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération du classement" },
      { status: 500 }
    );
  }
}


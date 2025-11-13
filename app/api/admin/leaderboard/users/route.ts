import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

/**
 * API Route pour récupérer tous les utilisateurs avec leurs stats de leaderboard
 * GET /api/admin/leaderboard/users
 * 
 * Query params:
 * - search: string (optionnel) - recherche par nom ou email
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";

    // Construire le filtre de recherche
    let filter: any = { role: "user", isApproved: true };

    if (searchQuery) {
      filter.$or = [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Récupérer les utilisateurs
    const users = await User.find(filter)
      .select("firstName lastName email points badges quizzes certificates projectsTaken")
      .populate("certificates")
      .populate("projectsTaken")
      .lean();

    // Trier par points décroissants
    const sortedUsers = users.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));

    // Ajouter le rang à chaque utilisateur
    const usersWithRank = sortedUsers.map((user: any, index: number) => ({
      id: user._id.toString(),
      rank: index + 1,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      points: user.points || 0,
      badges: user.badges || [],
      quizCount: user.quizzes?.length || 0,
      certificateCount: user.certificates?.length || 0,
      projectCount: user.projectsTaken?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      users: usersWithRank,
      total: usersWithRank.length,
    });
  } catch (error: any) {
    console.error("Erreur dans /api/admin/leaderboard/users:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur: " + error.message },
      { status: 500 }
    );
  }
}


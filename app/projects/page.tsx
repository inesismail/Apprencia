"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  technologies: string[];
  objectives: string[];
  status: "en cours" | "terminé" | "à venir";
  createdAt: string;
  updatedAt: string;
  takenBy?: string;
  takenAt?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des projets");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast({ title: "Succès", description: "Projet supprimé avec succès." });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du projet.",
        variant: "destructive",
      });
    }
  };

  const handleTakeProject = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter pour prendre un projet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/take`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      toast({ title: "Succès", description: "Projet pris avec succès !" });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur inconnue",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-9 max-w-7xl mx-auto p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Projets disponibles
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Découvrez les projets en cours, à venir ou finalisés.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Chargement des projets...</p>
      ) : error ? (
        <p className="text-center text-red-500">Erreur : {error}</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-slate-500">Aucun projet trouvé.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 rounded-2xl"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                    {isAdmin && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(project._id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="text-red-600 w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>⏱ {project.duration}</span>
                  <span>📋 {project.objectives?.length ?? 0} objectifs</span>
                  <span>📌 {project.status}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <Link href={`/projects/${project._id}`}>
                  <Button className="w-full">Voir les détails</Button>
                </Link>

                {!isAdmin && (
                  <>
                    {project.takenBy === user?._id ? (
                      <Button variant="secondary" className="w-full" disabled>
                        ✅ Projet déjà pris
                      </Button>
                    ) : project.takenBy ? (
                      (() => {
                        const takenAt = new Date(project.takenAt || "");
                        const now = new Date();
                        const diffInDays =
                          (now.getTime() - takenAt.getTime()) /
                          (1000 * 60 * 60 * 24);
                        const remaining = Math.ceil(7 - diffInDays);
                        return (
                          <Button
                            variant="destructive"
                            className="w-full"
                            disabled
                          >
                            ❌ Déjà pris – dispo dans{" "}
                            {remaining > 0 ? `${remaining} j` : "bientôt"}
                          </Button>
                        );
                      })()
                    ) : (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => handleTakeProject(project._id)}
                      >
                        🎯 Prendre ce projet
                      </Button>
                    )}
                  </>
                )}

                {(isAdmin || project.takenBy === user?._id) &&
                  project.status === "terminé" && (
                    <Badge className="w-full justify-center bg-green-100 text-green-800 text-sm py-2">
                      ✅ Projet terminé
                    </Badge>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {message && <p className="text-red-600 text-center mt-4">{message}</p>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Clock, User, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormationType = {
  _id: string;
  title: string;
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  duration?: string;
  instructor?: string;
  level?: string;
  category?: string;
};

export default function FormationPage() {
  const [formations, setFormations] = useState<FormationType[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<FormationType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/Formation")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFormations(data);
          setFilteredFormations(data);
        } else {
          setError("Données invalides.");
        }
      })
      .catch((err) => {
        console.error("Erreur chargement formations:", err);
        setError("Erreur lors du chargement des formations.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtrage des formations
  useEffect(() => {
    let filtered = formations;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par niveau
    if (selectedLevel !== "all") {
      filtered = filtered.filter((f) => f.level === selectedLevel);
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    setFilteredFormations(filtered);
  }, [searchQuery, selectedLevel, selectedCategory, formations]);

  const handleVoirDetail = (id: string) => {
    router.push(`/Formation/${id}`);
  };

  // Extraire les niveaux et catégories uniques
  const levels = Array.from(new Set(formations.map((f) => f.level).filter(Boolean)));
  const categories = Array.from(new Set(formations.map((f) => f.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement des formations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Nos Formations
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Découvrez nos formations pour développer vos compétences et atteindre vos objectifs professionnels
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Filtres et Recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* Filtre par niveau */}
                <div>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Tous les niveaux</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        Niveau {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre par catégorie */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compteur de résultats */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  {filteredFormations.length} formation{filteredFormations.length > 1 ? "s" : ""} trouvée{filteredFormations.length > 1 ? "s" : ""}
                </span>
                {(searchQuery || selectedLevel !== "all" || selectedCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLevel("all");
                      setSelectedCategory("all");
                    }}
                    className="text-primary hover:text-primary/80"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste des formations */}
        <AnimatePresence mode="wait">
          {filteredFormations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFormations.map((formation, index) => (
                <motion.div
                  key={formation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                    {/* Image/Vidéo */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {formation.photoUrl ? (
                        <img
                          src={formation.photoUrl}
                          alt={formation.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {formation.videoUrl && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Vidéo
                        </div>
                      )}
                      {formation.level && (
                        <Badge className="absolute top-2 left-2 bg-primary">
                          {formation.level}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                      {/* Catégorie */}
                      {formation.category && (
                        <Badge variant="outline" className="mb-3 w-fit">
                          {formation.category}
                        </Badge>
                      )}

                      {/* Titre */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {formation.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                        {formation.description}
                      </p>

                      {/* Infos */}
                      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
                        {formation.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formation.duration}</span>
                          </div>
                        )}
                        {formation.instructor && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="truncate max-w-[120px]">{formation.instructor}</span>
                          </div>
                        )}
                      </div>

                      {/* Bouton */}
                      <Button
                        onClick={() => handleVoirDetail(formation._id)}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        Voir la formation
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

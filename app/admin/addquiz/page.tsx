"use client";

import { useState, useEffect } from "react";

export default function AddQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("moyen");
  const [timeLimit, setTimeLimit] = useState(20);
  const [passingScore, setPassingScore] = useState(70);
  const [category, setCategory] = useState("Développement web");
  const [autoCalculateTime, setAutoCalculateTime] = useState(true);

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  // Calculer automatiquement le temps en fonction du nombre de questions et de la difficulté
  useEffect(() => {
    if (autoCalculateTime) {
      const numQuestions = questions.length;
      let timePerQuestion = 2; // minutes par question par défaut

      // Ajuster selon la difficulté
      if (difficulty === "facile") {
        timePerQuestion = 1.5; // 1.5 min par question
      } else if (difficulty === "moyen") {
        timePerQuestion = 2; // 2 min par question
      } else if (difficulty === "difficile") {
        timePerQuestion = 3; // 3 min par question
      }

      const calculatedTime = Math.ceil(numQuestions * timePerQuestion);
      setTimeLimit(calculatedTime);
    }
  }, [questions.length, difficulty, autoCalculateTime]);

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = parseInt(value);
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = {
      title,
      description,
      difficulty,
      timeLimit,
      passingScore,
      category,
      questions,
    };

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Quiz ajouté !");
        // Réinitialiser
        setTitle("");
        setDescription("");
        setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      } else {
        alert(data.message || "Erreur lors de l'ajout.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-card rounded-xl shadow-lg border border-border space-y-6">
      <h1 className="text-2xl font-bold text-primary">Ajouter un Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none" required />

        <div className="flex gap-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-1/3 border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
            required
          >
            <option value="facile">Facile (1.5 min/question)</option>
            <option value="moyen">Moyen (2 min/question)</option>
            <option value="difficile">Difficile (3 min/question)</option>
          </select>

          <div className="w-1/3 relative">
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => {
                setTimeLimit(parseInt(e.target.value));
                setAutoCalculateTime(false);
              }}
              placeholder="Durée (min)"
              className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            {autoCalculateTime && (
              <span className="absolute -bottom-5 left-0 text-xs text-green-600">
                ✓ Auto-calculé
              </span>
            )}
          </div>

          <input
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(parseInt(e.target.value))}
            placeholder="Score requis (%)"
            className="w-1/3 border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <input
            type="checkbox"
            id="autoTime"
            checked={autoCalculateTime}
            onChange={(e) => setAutoCalculateTime(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="autoTime" className="text-sm text-blue-800">
            <strong>Calcul automatique du temps :</strong> {questions.length} question{questions.length > 1 ? 's' : ''} × {difficulty === 'facile' ? '1.5' : difficulty === 'moyen' ? '2' : '3'} min = <strong>{timeLimit} minutes</strong>
          </label>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
          required
        >
          <option value="Développement web">Développement web</option>
          <option value="Programmation">Programmation</option>
          <option value="Base de données">Base de données</option>
          <option value="DevOps">DevOps</option>
          <option value="Sécurité">Sécurité</option>
          <option value="Design">Design</option>
          <option value="Mobile">Mobile</option>
          <option value="Cloud">Cloud</option>
          <option value="IA & Machine Learning">IA & Machine Learning</option>
          <option value="Autre">Autre</option>
        </select>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Questions</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="border border-border p-4 rounded-lg space-y-2 bg-muted/30">
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                placeholder={`Question ${idx + 1}`}
                className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  value={opt}
                  onChange={(e) => handleQuestionChange(idx, `option${optIdx}`, e.target.value)}
                  placeholder={`Option ${optIdx + 1}`}
                  className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              ))}
              <select
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {q.options.map((_, i) => (
                  <option key={i} value={i}>
                    Bonne réponse: Option {i + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="bg-muted border border-border px-4 py-2 rounded hover:bg-muted/80 transition">
            ➕ Ajouter une question
          </button>
        </div>

        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition">
          ✅ Enregistrer le quiz
        </button>
      </form>
    </div>
  );
}

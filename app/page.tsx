"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Initialiser email, password, rememberMe en lisant dans localStorage au chargement
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("savedEmail");
      const savedPassword = localStorage.getItem("savedPassword");
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const fullUser = data.user;

        // Stocker les infos utilisateur (comme avant)
      const storage = localStorage;

        storage.setItem("user", JSON.stringify(fullUser));
        storage.setItem("userId", fullUser._id);
        storage.setItem("email", fullUser.email);
        storage.setItem("lastName", fullUser.lastName);
        storage.setItem("userName", fullUser.firstName);
        storage.setItem("userRole", fullUser.role);
        storage.setItem("ProjecTaken", JSON.stringify(fullUser.projectsTaken || []));
        storage.setItem("quizzes", JSON.stringify(fullUser.quizzes || []));
        storage.setItem("certificates", JSON.stringify(fullUser.certificates || []));

        // Sauvegarder ou supprimer email et password dans localStorage selon rememberMe
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        // Redirection selon rôle
        const userRole = fullUser.role;
        if (userRole === "admin") {
          router.push("/admin/progress");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      setError("Erreur serveur. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background animé avec gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600">
        {/* Bulles flottantes animées */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Container principal avec effet glassmorphism */}
      <div className="relative flex w-full max-w-5xl backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Illustration avec effet glass */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-10">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-600/30 backdrop-blur-sm"></div>

          {/* Image avec effet */}
          <div className="relative z-10">
            <img
              src="/login.jpg"
              className="w-full max-w-md drop-shadow-2xl rounded-2xl"
              alt="Illustration de connexion"
            />
          </div>

          {/* Éléments décoratifs */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/30 rounded-lg rotate-45"></div>
        </div>

        {/* Formulaire avec glass effect */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 space-y-6 backdrop-blur-xl bg-white/80 relative">
          {/* Titre avec gradient */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Bienvenue
            </h2>
            <p className="text-gray-600 text-sm">Connectez-vous pour continuer</p>
          </div>

          {/* Message d'erreur avec style glassmorphism */}
          {error && (
            <div className="backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-700 text-center text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Champ Email avec effet glass */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                {/* Icône décorative */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Champ Password avec effet glass */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                {/* Icône décorative */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500/50"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition">Se souvenir de moi</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion avec effet glass et gradient */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg
                       bg-gradient-to-r from-teal-500 to-cyan-600
                       shadow-lg hover:shadow-2xl hover:scale-[1.02]
                       transition-all duration-300 relative overflow-hidden group
                       ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Lien inscription avec style glass */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link
                href="/signup"
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Divider décoratif */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="backdrop-blur-xl bg-white/80 px-4 text-gray-500 font-medium">
                Connexion sécurisée
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/"); // redirection vers login
      } else {
        setError(data.error || "Erreur lors de la création du compte");
      }
    } catch (err) {
      setError("Erreur serveur. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background animé avec gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600">
        {/* Bulles flottantes animées */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Container principal avec effet glassmorphism */}
      <div className="relative flex w-full max-w-6xl backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Illustration avec effet glass */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-10">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-teal-600/30 backdrop-blur-sm"></div>

          {/* Image avec effet */}
          <div className="relative z-10">
            <img
              src="/login.jpg"
              alt="Illustration d'inscription"
              className="w-full max-w-md drop-shadow-2xl rounded-2xl"
            />
          </div>

          {/* Éléments décoratifs */}
          <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white/30 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 border-2 border-white/30 rounded-lg rotate-12"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 border-2 border-white/20 rounded-full"></div>
        </div>

        {/* Formulaire avec glass effect */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12 space-y-5 backdrop-blur-xl bg-white/80 relative max-h-[90vh] overflow-y-auto">
          {/* Titre avec gradient */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Rejoignez-nous
            </h2>
            <p className="text-gray-600 text-sm">Créez votre compte en quelques secondes</p>
          </div>

          {/* Message d'erreur avec style glassmorphism */}
          {error && (
            <div className="backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-700 text-center text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid pour Prénom et Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prénom */}
              <div className="relative group">
                <input
                  name="firstName"
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  disabled={loading}
                  autoComplete="given-name"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Nom */}
              <div className="relative group">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  disabled={loading}
                  autoComplete="family-name"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                         transition-all duration-300 placeholder:text-gray-400
                         shadow-lg hover:shadow-xl group-hover:bg-white/60"
                disabled={loading}
                autoComplete="email"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Grid pour Téléphone et Date de naissance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Téléphone */}
              <div className="relative group">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  disabled={loading}
                  autoComplete="tel"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              {/* Date de naissance */}
              <div className="relative group">
                <input
                  name="birthDate"
                  type="date"
                  placeholder="Date de naissance"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                           transition-all duration-300 placeholder:text-gray-400
                           shadow-lg hover:shadow-xl group-hover:bg-white/60"
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div className="relative group">
              <input
                name="password"
                type="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 backdrop-blur-xl bg-white/50 border border-white/30 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                         transition-all duration-300 placeholder:text-gray-400
                         shadow-lg hover:shadow-xl group-hover:bg-white/60"
                disabled={loading}
                autoComplete="new-password"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Bouton de création avec effet glass et gradient */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg
                       bg-gradient-to-r from-cyan-500 to-teal-600
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
                    Création en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Créer mon compte
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Lien connexion avec style glass */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <a
                href="/"
                className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>

          {/* Divider décoratif */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="backdrop-blur-xl bg-white/80 px-4 text-gray-500 font-medium">
                Inscription sécurisée
              </span>
            </div>
          </div>

          {/* Info sécurité */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Vos données sont protégées et sécurisées</span>
          </div>
        </div>
      </div>
    </div>
  );
}

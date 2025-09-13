"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useRegister";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    registerMutation.mutate(
      {
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        phone: `+241${formData.get("phone")}`,
        secondphone: `+241${formData.get("secondphone")}`,
        password: String(formData.get("password")),
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setMessage({ type: "success", text: "Inscription réussie 🎉" });
            setTimeout(() => router.push("/profil"), 2000);
          } else {
            setMessage({ type: "error", text: data.error || "Erreur d'inscription" });
          }
        },
        onError: (err) => {
          setMessage({ type: "error", text: err.message });
        },
      }
    );
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="text-center text-xl font-bold">S&rsquo;inscrire</legend>

        {message && (
          <div
            role="alert"
            className={`alert mb-2 ${message.type === "success" ? "alert-success" : "alert-error"
              }`}
          >
            <span>{message.text}</span>
          </div>
        )}

        <label className="label">Votre nom</label>
        <input type="text" name="lastName" className="input" placeholder="votre nom" required />

        <label className="label">Votre prenom</label>
        <input type="text" name="firstName" className="input" placeholder="votre prenom" required />

        <label className="label">Numéro de téléphone</label>
        <div className="flex items-center border rounded input">
          <span className="px-2 font-bold select-none">+241</span>
          <input
            type="tel"
            name="phone"
            placeholder="numero de telephone"
            className="input border-none focus:outline-none w-full"
            maxLength={9}
            pattern="\d{9}"
            required
          />
        </div>


        <label className="label">Deuxieme numero téléphone</label>
        <div className="flex items-center border rounded input">
          <span className="px-2 font-bold select-none">+241</span>
          <input
            type="tel"
            name="secondphone"
            placeholder="numero de telephone"
            className="input border-none focus:outline-none w-full"
            maxLength={9}
            pattern="\d{9}"
            required
          />
        </div>

        <label className="label">Créer un mot de passe</label>
        <input type="password" name="password" placeholder="creer un mot de passe" className="input" required />

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="btn btn-neutral mt-4 rounded-3xl"
        >
          {registerMutation.isPending && (
            <span className="loading loading-spinner loading-xs mr-2" />
          )}
          Inscrivez-vous
        </button>

        <div className="text-center my-3">
          j&rsquo;ai déjà un compte{" "}
          <span className="link font-semibold"></span>

          <Link className="link font-semibold" href="/login">me connectez</Link>
        </div>
      </form>
    </section>
  );
}

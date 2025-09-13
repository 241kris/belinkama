"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const messagelogin = searchParams.get("message");

  const router = useRouter();
  const loginMutation = useLogin();

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (messagelogin) {
      setMessage({ type: "error", text: messagelogin });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [messagelogin]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loginMutation.mutate(
      {
        phone: String(formData.get("phone")),
        password: String(formData.get("password")),
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setMessage({ type: "success", text: "Connexion réussie ✅" });
            setTimeout(() => router.push("/"), 2000);
          } else {
            setMessage({ type: "error", text: data.error || "Identifiants incorrects" });
          }
        },
        onError: (err) => {
          setMessage({ type: "error", text: err.message });
        },
      }
    );
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      {message && (
        <div
          role="alert"
          className={`alert mb-2 ${
            message.type === "success"
              ? "alert-success"
              : message.type === "error"
              ? "alert-error"
              : "alert-warning"
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="text-center text-xl font-bold">Se connecter</legend>

        <label className="label">Numéro de téléphone</label>
        <div className="flex items-center border rounded input">
          <span className="px-2 font-bold select-none">+241</span>
          <input
            type="text"
            name="phone"
            inputMode="numeric"
            pattern="[0-9]{9}"
            maxLength={9}
            className="input border-none focus:outline-none w-full"
            placeholder="770013555"
            required
          />
        </div>

        <label className="label">Votre mot de passe</label>
        <input type="password" name="password" className="input" placeholder="Mot de passe" required />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn btn-neutral mt-4 rounded-3xl"
        >
          {loginMutation.isPending && (
            <span className="loading loading-spinner loading-xs mr-2" />
          )}
          Connectez-vous
        </button>

        <div className="text-center my-3">
          Je n&rsquo;ai pas de compte{" "}
          <Link className="link font-semibold" href="/register">m&rsquo;inscrire</Link>
        </div>
      </form>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}

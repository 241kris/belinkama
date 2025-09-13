 "use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logement } from "@/types/logements";
import * as actions from "@/app/actions/logementActions"; // Server Actions
import { getMyLogements } from "@/app/actions/getMyLogements";

// 🔹 Utilitaire pour récupérer le message d’erreur
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Une erreur inconnue est survenue";
}

export default function MesLogementsClient() {
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch des logements au montage
  useEffect(() => {
    getMyLogements()
      .then((data) => setLogements(data))
      .catch((err: unknown) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Supprimer un logement
  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirmer la suppression du logement ?")) return;
    try {
      await actions.deleteLogement(id);
      setLogements((prev) => prev.filter((l) => l.id !== id));
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  // 🔹 Activer / Désactiver un logement
  const handleToggle = async (id: string, status: string) => {
    if (!window.confirm(`${status === "ACTIF" ? "Désactiver" : "Activer"} ce logement ?`)) return;
    try {
      const updated = await actions.toggleLogementStatus(id);
      setLogements((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: updated.status } : l))
      );
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (logements.length === 0)
    return <div className="alert alert-warning">Vous n’avez encore aucun logement publié.</div>;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-7 text-black">
      {logements.map((l) => (
        <div key={l.id} className="card p-2 shadow-sm relative">
          {l.status?.toUpperCase() === "BLOQUE" && (
            <div role="alert" className="alert absolute m-2 alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                  1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
                  0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Annonce bloquée</span>
            </div>
          )}
          <Link href={`/logement/${l.slug}`}>
            <Image
              src={l.images?.[0]?.secureUrl || "/profile.png"}
              width={250}
              height={250}
              alt={l.titre}
              className="object-cover rounded-md"
            />
          </Link>
          <div className="card-body text-start p-2">
            <h2 className="font-extrabold text-base">{l.titre}</h2>
            <span>{l.lieu}</span>
            <span className="font-semibold text-sm">
              {l.prix.toLocaleString()} FCFA / mois
            </span>
            <span className="text-xs">
              publié le {new Date(l.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleDelete(l.id)}
              className="btn btn-error btn-xs rounded-3xl"
            >
              Supprimer
            </button>
            <button
              onClick={() => handleToggle(l.id, l.status)}
              disabled={l.status === "BLOQUE"}
              className={`btn btn-warning btn-xs rounded-3xl ${
                l.status === "ACTIF" ? "" : "btn-outline"
              }`}
            >
              {l.status === "ACTIF" ? "Désactiver" : "Activer"}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getMyLogements, MyLogement } from "@/app/actions/getLogements"; // ✅ correction

export default function ListLogements() {
  const [logements, setLogements] = useState<MyLogement[]>([]);
  const [filtered, setFiltered] = useState<MyLogement[]>([]);
  const [today, setToday] = useState<MyLogement[]>([]);
  const [budget, setBudget] = useState(300000);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ⚠️ tu dois passer un `userId` ici
      const userId = "123"; // 🔴 à remplacer par l’ID utilisateur réel
      const data = await getMyLogements(userId);

      // Séparer les logements publiés aujourd&apos;hui
      const now = new Date();
      const todayList = data.filter((l: MyLogement) => {
        const created = new Date(l.createdAt);
        return (
          created.getFullYear() === now.getFullYear() &&
          created.getMonth() === now.getMonth() &&
          created.getDate() === now.getDate()
        );
      });

      const restList = data
        .filter((l) => !todayList.includes(l))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      setToday(todayList);
      setLogements(restList);
      setFiltered(restList);
      setMessage("OK");
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let results = logements.filter((l) => l.prix <= budget);
    if (type) results = results.filter((l) => l.type === type);
    setFiltered(results);
  }, [budget, type, logements]);

  return (
    <>
      {/* Filtres */}
      <div className="h-70 flex justify-center items-center">
        <div>
          <div className="w-full flex justify-center flex-col">
            <input
              type="range"
              min={30000}
              max={500000}
              step={10000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="range w-full"
            />
            <div className="mt-3 text-center text-sm">
              Budget limite : {budget.toLocaleString()} FCFA
            </div>
          </div>

          <label className="label text-sm mt-4">Que recherchez-vous ?</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select w-full"
          >
            <option value="">Tous</option>
            <option value="maison">Maison</option>
            <option value="studio">Studio</option>
            <option value="chambre">Chambre</option>
            <option value="appartement">Appartement</option>
          </select>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="flex h-full items-center justify-center my-4">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : (
        <>
          {/* Logements publiés aujourd&apos;hui */}
          {today.length > 0 && (
            <section className="p-4">
              <h1 className="text-xl my-2 font-extrabold text-error">
                Publié aujourd&apos;hui
              </h1>
              <div className="flex overflow-x-auto gap-4 py-2">
                {today.map((logement) => (
                  <div
                    key={logement.id}
                    className="card border border-gray-400 p-2 w-64 min-w-[16rem] shadow-sm flex-shrink-0"
                  >
                    <Link href={`/logement/${logement.slug}`}>
                      <figure className="hover-gallery h-45">
                        <Image
                          src={
                            logement.images?.[0]?.secureUrl || "/profile.png"
                          }
                          width={500}
                          height={500}
                          alt={logement.titre}
                          className="object-cover rounded-md"
                        />
                      </figure>
                    </Link>
                    <div className="card-body text-start text-black">
                      <span className="text-xs">{logement.type}</span>
                      <h2 className="font-extrabold text-base">
                        {logement.titre}
                      </h2>
                      <span className="badge badge-sm badge-info">
                        {logement.lieu}
                      </span>
                      <span className="font-semibold text-sm">
                        {logement.prix.toLocaleString()} FCFA / mois
                        <span className="ms-2 text-error">
                          {logement.charge
                            ? "avec charges"
                            : "sans charges"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Autres logements */}
          {filtered.length === 0 ? (
            (budget !== 300000 || type !== "") && (
              <div className="alert alert-warning my-4 col-span-full">
                <span>Aucun logement trouvé avec ces critères</span>
              </div>
            )
          ) : (
            <section className="p-4">
              <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {filtered.map((logement) => (
                  <div
                    key={logement.id}
                    className="card border border-gray-400 p-2 w-full shadow-sm"
                  >
                    <Link href={`/logement/${logement.slug}`}>
                      <figure className="h-45">
                        <Image
                          src={
                            logement.images?.[0]?.secureUrl || "/profile.png"
                          }
                          width={500}
                          height={500}
                          alt={logement.titre}
                          className="object-cover rounded-md"
                        />
                      </figure>
                    </Link>
                    <div className="card-body text-start text-black">
                      <span className="text-xs">{logement.type}</span>
                      <h2 className="font-extrabold text-base">
                        {logement.titre}
                      </h2>
                      <span className="badge badge-sm badge-info">
                        {logement.lieu}
                      </span>
                      <span className="font-semibold text-sm">
                        {logement.prix.toLocaleString()} FCFA / mois
                        <span className="ms-2 text-error">
                          {logement.charge
                            ? "avec charges"
                            : "sans charges"}
                        </span>
                      </span>
                      <span className="text-xs">
                        publié le{" "}
                        {new Date(
                          logement.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

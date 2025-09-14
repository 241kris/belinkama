"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCreateLogement } from "../hooks/useLogement";
import Nav from "../components/Nav";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export default function Page() {


    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (!data.user) {
                router.replace("/login?message=connectez-vous afin de passer une annonce");
            }
        };

        checkAuth();
    }, [router]);

    const token = "user-jwt-token"; // 👉 récupère ton vrai JWT depuis auth
    const createLogement = useCreateLogement(token);
    const [type, setType] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});


    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const newErrors: Record<string, string> = {};

        // ✅ Validation des champs obligatoires
        if (!formData.get("titre")) newErrors.titre = "Veuillez entrer un titre.";
        if (!formData.get("type")) newErrors.type = "Veuillez choisir un type de logement.";
        if (!formData.get("lieu")) newErrors.lieu = "Veuillez indiquer le lieu.";
        if (!formData.get("prix")) newErrors.prix = "Veuillez renseigner le prix.";
        if (!formData.get("description")) newErrors.description = "Veuillez décrire le logement.";
        if (!formData.get("toilette")) newErrors.toilette = "Veuillez sélectionner le type de toilette.";
        if (!formData.get("charge")) newErrors.charge = "Veuillez préciser si le prix inclut les charges.";

        // ✅ Vérif images avant envoi
        const files = formData.getAll("images") as File[];
        if (!files.length) {
            newErrors.image = "Veuillez ajouter au moins une image.";
        } else {
            for (const file of files) {
                if (!allowedMimeTypes.includes(file.type)) {
                    newErrors.image = "Seules les images JPG, JPEG, PNG ou WEBP sont acceptées.";
                    break;
                }

            }
        }

        // ✅ Bloc B : chambre/douche/cuisine requis seulement si ≠ studio/chambre
        if (type !== "studio" && type !== "chambre") {
            if (!formData.get("chambre")) newErrors.chambre = "Veuillez indiquer le nombre de chambres.";
            if (!formData.get("douche")) newErrors.douche = "Veuillez indiquer le nombre de douches.";
            if (!formData.get("cuisine")) newErrors.cuisine = "Veuillez indiquer le nombre de cuisines.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // ✅ Convertir toilette en bool
        const toilette = formData.get("toilette");
        if (toilette === "interieur") {
            formData.set("toilette", "true");
        } else if (toilette === "exterieur") {
            formData.set("toilette", "false");
        }

        try {
            await createLogement.mutateAsync(formData);
            setSuccess(true);


            const audio = new Audio("/notif/notif.wav");
            audio.play().catch((err) => {
                console.error("Impossible de jouer le son :", err);
            });
            // Nettoyer le formulaire
            form.reset();
            setType("");

            // Masquer le message après 5s
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: unknown) {
            if (err && typeof err === "object") {
                const e = err as {
                    issues?: Array<{ path?: string[]; message: string }>;
                    error?: string
                };

                if (e.issues) {
                    const backErrors: Record<string, string> = {};
                    for (const issue of e.issues) {
                        if (issue.path?.[0]) {
                            backErrors[issue.path[0]] = issue.message;
                        }
                    }
                    setErrors(backErrors);
                } else if (e.error) {
                    setErrors({ global: e.error });
                }
            }
        }

    }

    return (
        <>
            <Nav />
            <h1 className="text-2xl text-center font-extrabold">Passer une annonce</h1>
            <section className="p-5 space-y-5">
                <form onSubmit={handleSubmit}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 space-y-3">


                        {errors.global && <p className="text-red-500">{errors.global}</p>}

                        {/* bloc 1 */}
                        <label className="label text-sm text-black">Titre de l&rsquo;annonce</label>
                        {errors.titre && <p className="text-red-500">{errors.titre}</p>}
                        <input
                            type="text"
                            name="titre"
                            className="input w-full"
                            placeholder="Titre de votre annonce"
                        />


                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <label className="label text-sm text-black">Type de logement</label>
                                {errors.type && <p className="text-red-500">{errors.type}</p>}
                                <select
                                    name="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="select w-full"
                                >
                                    <option value="">Choisir...</option>
                                    <option value="maison">Maison</option>
                                    <option value="studio">Studio</option>
                                    <option value="chambre">Chambre</option>
                                    <option value="appartement">Appartement</option>
                                </select>

                            </div>

                            <div>
                                <label className="label text-sm text-black">Lieu</label>
                                {errors.lieu && <p className="text-red-500">{errors.lieu}</p>}
                                <input
                                    type="text"
                                    name="lieu"
                                    className="input w-full"
                                    placeholder="Où se trouve le logement ?"
                                />

                            </div>
                        </div>

                        <label className="label text-sm text-black">Images du logement</label>
                        {errors.image && <p className="text-red-500">{errors.image}</p>}

                        <input
                            type="file"
                            name="images"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="file-input w-full"
                        />

                        {/* bloc 2 — caché si studio ou chambre */}
                        {type !== "studio" && type !== "chambre" && (
                            <>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <label className="label text-sm text-black">Nombre de chambres</label>
                                        {errors.chambre && <p className="text-red-500">{errors.chambre}</p>}
                                        <input type="number" name="chambre" className="input w-full" min={0} />

                                    </div>
                                    <div>
                                        <label className="label text-sm text-black">Nombre de douches</label>
                                        {errors.douche && <p className="text-red-500">{errors.douche}</p>}
                                        <input type="number" name="douche" className="input w-full" min={0} />

                                    </div>
                                </div>

                                <label className="label text-sm text-black">Nombre de cuisines</label>
                                {errors.cuisine && <p className="text-red-500">{errors.cuisine}</p>}
                                <input type="number" name="cuisine" className="input w-full" min={0} />

                            </>
                        )}

                        {/* bloc 3 */}
                        <div className="flex items-center gap-5 justify-between my-4">
                            <label className="flex items-center gap-2 text-sm text-black">
                                <input type="radio" name="toilette" value="exterieur" className="radio" />
                                Toilette extérieure
                            </label>
                            <label className="flex items-center gap-2 text-sm text-black">
                                <input type="radio" name="toilette" value="interieur" className="radio" />
                                Toilette intérieure
                            </label>
                        </div>
                        {errors.toilette && <p className="text-red-500">{errors.toilette}</p>}
                        <label className="label text-sm text-black">Particularités du logement</label>

                        {errors.particularite && <p className="text-red-500">{errors.particularite}</p>}


                        <div className="space-y-2">
                            {[
                                "Très proche de la route",
                                "Equipé d'un climatiseur",
                                "Compteur EDAN personnel",
                                "Wifi disponible",
                                "Situé dans une barrière",
                                "Eau à l'intérieur",
                                "Terrasse",
                                "Salon commun"
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="particularite"
                                        value={option}
                                        className="checkbox"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>



                        <label className="label text-sm text-black">Prix</label>
                        {errors.prix && <p className="text-red-500">{errors.prix}</p>}
                        <input type="number" name="prix" className="input w-full" min={0} />


                        <label className="label text-sm text-black">Avec charge</label>
                        {errors.charge && <p className="text-red-500">{errors.charge}</p>}
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="charge" value="true" className="radio" />
                                Oui
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="charge" value="false" className="radio" />
                                Non
                            </label>
                        </div>


                        <label className="label text-sm text-black">Description</label>
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                        <textarea
                            name="description"
                            className="textarea w-full"
                            placeholder="Décrivez le logement..."
                        ></textarea>

                        {success && (
                            <div role="alert" className="alert alert-success">
                                <span>Annonce enregistrée avec succès</span>
                            </div>
                        )}
                          
                        <div className="my-7 flex gap-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm rounded-3xl w-full"
                                disabled={createLogement.isPending}
                            >
                                {createLogement.isPending && (
                                    <span className="loading loading-spinner loading-xs"></span>
                                )}
                                Valider
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </>

    );
}

 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IoLogoWhatsapp } from "react-icons/io";
import { ImageType, Logement } from "@/types/logements";
import Wrapper from "@/app/components/Wrapper";
import { reportLogement } from "@/app/actions/reportLogement"; // ✅ action server

export default function LogementPage() {
  const { slug } = useParams<{ slug: string }>();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchLogement = async () => {
      try {
        const res = await fetch(`/api/logement/${slug}`);
        if (!res.ok) throw new Error("Erreur API logement");
        const data: Logement = await res.json();
        setLogement(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogement();
  }, [slug]);

  const handleShareWhatsapp = () => {
    const text = `Découvrez ce logement sur Belinkama:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Erreur inconnue";
};

const handleReport = async (type: "OCCUPE" | "FAUSSE_ANNONCE") => {
  if (!logement) return;

  try {
    const res = await reportLogement(logement.id, type);
    setMessage({ type: "success", text: res.message });
  } catch (err: unknown) {
    setMessage({ type: "error", text: getErrorMessage(err) || "Erreur lors du signalement" });
  } finally {
    setTimeout(() => setMessage(null), 4000);
  }
};


  if (loading) return <p className="text-center">Chargement...</p>;
  if (!logement)
    return (
      <div role="alert" className="alert alert-error m-4">
        <span>Logement introuvable</span>
      </div>
    );

  return (
    <Wrapper>
      {/* Carousel images */}
      <div className="carousel carousel-center bg-neutral rounded-box w-full md:w-1/2 space-x-4 p-4 h-70">
        {logement.images.map((img: ImageType, i: number) => (
          <div key={img.id ?? i} className="carousel-item">
            <Image
              src={img.secureUrl}
              alt={`Image de ${logement.titre}`}
              width={400}
              height={300}
              className="rounded-box object-cover"
            />
          </div>
        ))}
      </div>

      {/* Bouton partager */}
      <button
        onClick={handleShareWhatsapp}
        className="btn btn-active btn-sm rounded-3xl mt-4 flex items-center gap-2"
      >
        <IoLogoWhatsapp className="text-xl text-green-600" />
        <span className="text-xs">Partager sur WhatsApp</span>
      </button>
      <span className="text-xs">
        publié le {new Date(logement.createdAt).toLocaleDateString()}
      </span>

      {/* Infos logement */}
      <div className="mt-4">
        <h1 className="text-2xl font-extrabold">{logement.titre}</h1>
        <ul>
          <li className="text-sm link">{logement.lieu}</li>
          <li>
            <span className="badge badge-sm badge-success">
              {logement.prix.toLocaleString()} FCFA / mois
            </span>{" "}
            <span className="text-sm">
              {logement.charge ? "avec charge" : "sans charge"}
            </span>
          </li>
        </ul>

        {/* Particularités */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold link">Particularités</h2>
          <ul className="text-sm">
            {logement.particularité?.map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <div className="mt-7">
          <h2 className="text-sm font-semibold link">Description</h2>
          <p className="text-justify text-sm">{logement.description}</p>
        </div>

        {/* Auteur */}
        <div className="mt-7">
          <h2 className="text-sm link text-success">Auteur de l&rsquo;annonce</h2>
          <ul className="text-sm mt-5">
            <li>
              {logement.user.firstName} {logement.user.lastName}
            </li>
            <li>Téléphone : {logement.user.phone}</li>
            <li>Téléphone 2 : {logement.user.secondphone}</li>
          </ul>
        </div>
      </div>

      {/* Zone signalement */}
      <div className=" py-7 flex flex-col items-start">
         {message && (
          <div
            className={`ml-3 text-xs ${
              message.type === "success" ? "text-success" : "text-error"
            }`}
          >
            {message.text}
          </div>
        )}
        <details className="dropdown dropdown-right">
          <summary className="btn btn-xs rounded-3xl btn-error">
            Signaler cette annonce
          </summary>
          <ul className="menu dropdown-content bg-base-300 rounded-box z-10 w-52 p-2 shadow-sm">
            <li>
              <button
                className="font-semibold link"
                onClick={() => handleReport("OCCUPE")}
              >
                Logement occupé
              </button>
            </li>
            <li>
              <button
                className="font-semibold link"
                onClick={() => handleReport("FAUSSE_ANNONCE")}
              >
                C&rsquo;est un démarcheur
              </button>
            </li>
          </ul>
        </details>
       
      </div>
    </Wrapper>
  );
}

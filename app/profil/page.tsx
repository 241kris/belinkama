// app/profil/page.tsx
import Nav from "../components/Nav";
import MesLogements from "../components/MesLogements";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login"); // redirige si pas connecté
  }

  let payload: { userId: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      secondphone: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <>
      <Nav />
      <section className="p-4">
        <div className="flex flex-col gap-2 mb-7 bg-base-200 p-3">
          <span className="font-extrabold text-2xl">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm">Téléphone : {user.phone}</span>
          <span className="text-sm">Téléphone 2 : {user.secondphone}</span>
          <span className="text-sm">
            Inscrit le : {new Date(user.createdAt).toLocaleDateString()}
          </span>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="btn btn-xs btn-error w-30 rounded-3xl"
            >
              Se déconnecter
            </button>
          </form>
        </div>


        {/* ✅ peut être async sans problème car Server Component */}
        <MesLogements />
      </section>

    </>
  );
}

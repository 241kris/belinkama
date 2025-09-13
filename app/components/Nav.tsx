'use client'

import Link from 'next/link'
import { SlOptionsVertical } from "react-icons/sl";
import React from 'react'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

// Hook pour récupérer le user connecté
async function fetchCurrentUser() {
  const res = await fetch("/api/me", { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.user
}

export default function Nav() {
  const pathname = usePathname()

  // react-query → pour avoir un état dynamique du user
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  })

  // toutes les entrées possibles du menu
  const links = [
    { href: "/", label: "Accueil" },
    { href: "/profil", label: "Mon profil" },
    { href: "/register-home", label: "Passer une annonce" },
    { href: "/login", label: "Se connecter", hideIfAuth: true },
    { href: "/register", label: "S'inscrire", hideIfAuth: true },
  ]

  return (
    <div className='m-5'>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Bouton drawer */}
          <label htmlFor="my-drawer-4" className="drawer-button btn rounded-2xl btn-xs ">
            <SlOptionsVertical className='font-extrabold text-base text-success' />
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {links
              .filter(link => {
                // cache login/register si connecté
                if (user && link.hideIfAuth) return false
                // cache le lien de la page courante
                if (pathname === link.href) return false
                return true
              })
              .map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

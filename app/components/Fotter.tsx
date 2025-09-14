import Link from 'next/link'
import React from 'react'

export default function Fotter() {
    return (
        < >

            <footer className="footer  footer-horizontal footer-center bg-gray-900 text-gray-300 content p-10  ">
                <aside>
                    <span className='text-sm font-sebibold text-center'>Belinkama | Plateforme de recherche de logements au Gabon</span>
                    <p className="link">
                        <Link href="https://softkris.vercel.app/">réalisé par kris  Codeur_241 </Link>
                    </p>

                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>

            </footer>

        </>
    )
}

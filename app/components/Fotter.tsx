import Link from 'next/link'
import React from 'react'

export default function Fotter() {
    return (
        < >

            <footer className="footer  footer-horizontal footer-center bg-gray-900 text-gray-300 content p-10  ">
                <aside>

                    <p className="link">                       
                        <Link href="https://softkris.vercel.app/">réalisé par kris </Link>
                    </p>

                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>

            </footer>

        </>
    )
}

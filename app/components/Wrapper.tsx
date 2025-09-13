'use client'
import React, { ReactNode } from 'react'
import Nav from './Nav'
 
 


export default function Wrapper({ children }: { children: ReactNode }) {

  return (
    <>
    <Nav/>
       
      <main className="px-2 md:px-[2%] mt-6">{children}</main>
    

    </>
  )
}

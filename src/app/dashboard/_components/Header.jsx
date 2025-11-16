
"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { use, useEffect } from 'react'

function Header() {
    const path = usePathname();
    useEffect(() => {  
    }, [path])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src = {'/logo.svg'} width={150} height={150} alt = 'logo'/>
      <ul className=' hidden md:flex gap-6'> 
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard' && 'font-bold text-primary'}
            `}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard/questions' && 'font-bold text-primary'}
            `}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard/how' && 'font-bold text-primary'}
            `}>How it Works?</li>
      </ul>

      <UserButton/>
    </div>
  )
}

export default Header

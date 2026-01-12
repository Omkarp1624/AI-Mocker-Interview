
"use client"
import { UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function Header() {
    const path = usePathname();
    useEffect(() => {  
    }, [path])
  return (
    <div className='flex p-6 items-center justify-between bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-400/30 shadow-lg'>
      <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
          AI
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">PrepPro AI</h1>
      </Link>
      
      <ul className='hidden md:flex gap-8'> 
        <li className={`hover:text-cyan-400 font-medium transition-all cursor-pointer
            ${path === '/dashboard' ? 'text-cyan-400' : 'text-gray-300'}
            `}>Dashboard</li>
        <li className={`hover:text-cyan-400 font-medium transition-all cursor-pointer
            ${path === '/dashboard/questions' ? 'text-cyan-400' : 'text-gray-300'}
            `}>Questions</li>
        <li className={`hover:text-cyan-400 font-medium transition-all cursor-pointer
            ${path === '/dashboard/how' ? 'text-cyan-400' : 'text-gray-300'}
            `}>How it Works?</li>
      </ul>

      <UserButton/>
    </div>
  )
}

export default Header

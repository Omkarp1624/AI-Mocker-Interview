'use client'
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function Header({ showUserButton = true }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm shadow z-50">
      <div className="flex items-center gap-6">
        {/* logo at top-left */}
        <div className="flex items-center">
          <Image src="/logo.svg" width={140} height={36} alt="logo" />
        </div>

        {/* nav items adjacent to logo */}
        <nav>
          <ul className="flex items-center space-x-6 text-sm">
            <li className="hover:underline cursor-pointer">Dashboard</li>
            <li className="hover:underline cursor-pointer">Questions</li>
            <li className="hover:underline cursor-pointer">Update</li>
            <li className="hover:underline cursor-pointer">How it Works?</li>
          </ul>
        </nav>
      </div>

      {/* user button on the right */}
      <div>{showUserButton ? <UserButton /> : null}</div>
    </header>
  )
}
import React from 'react'
import Header from './_components/Header'

function DashboardLayout({children}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header/>
        <div className='mx-5 md:mx-20 lg:mx-36 py-12'>
        {children}
        </div>
      
    </div>
  )
}

export default DashboardLayout

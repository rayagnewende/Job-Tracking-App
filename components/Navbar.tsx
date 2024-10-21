import React from 'react'
import LinksDropdown from './LinksDropdown'
import { UserButton } from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  return (
    <nav className="bg-muted py-4 px-4 flex justify-between items-center  sm:px-16 lg:px-24 ">
        <div>
        <LinksDropdown   />
        </div>
        <div className='flex items-center gap-x-4'>
          <ThemeToggle /> 
          <UserButton  afterSignOutUrl='/' />
        </div>
    </nav>
  )
}

export default Navbar
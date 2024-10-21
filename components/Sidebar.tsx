'use client'
import React from 'react' 
import logo from "@/assets/logo.svg" ; 
import Image from 'next/image';
import links from "@/utils/links"; 
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
function Sidebar() {
   const pathname = usePathname(); 
  return (
    <aside className='py-4 px-8 h-full bg-muted'>
        <Image  src={logo}  alt='logo' className='mx-auto' />
        <div className="flex flex-col mt-20 gap-y-4">
           {
              links.map( link => {
                   return <Button asChild key={link.href} variant={pathname === link.href ? 'default' : 'link'}>
                        <Link href={link.href} className='flex items-center gap-x-2'>
                         {link.icon} <span className="capitalize">{link.label}</span>
                        </Link>
                   </Button>
              })
           }
        </div>
    </aside>
  )
}

export default Sidebar
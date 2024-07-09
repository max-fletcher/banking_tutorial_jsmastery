"use client"

import Image from "next/image"
import Link from "next/link"
import { sidebarLinks } from "../constants"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname()

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image 
            src="/icons/logo.svg" 
            width={34} 
            height={34} 
            alt="Horizon logo" 
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

          console.log(pathname, item.route)

          return (
            <Link 
              key={item.label}
              href={item.route}
              className={cn('sidebar-link', { 'bg-bank-gradient' : isActive } )} // A util function that merges classes. Uses twMerge under the hood.
              >
                <div className="relative size-6">
                  <Image 
                    fill
                    src={item.imgURL}
                    alt={item.label} 
                    className={cn({'brightness-[3] invert-0' : isActive})} // A util function that merges classes. Uses twMerge under the hood.
                  />
                </div>
                <p className={cn("sidebar-label", { "!text-white": isActive }) }>
                  {item.label}
                </p>
              </Link>
          )
        })}
        USER
      </nav>
      FOOTER
    </section>
  )
}

export default Sidebar
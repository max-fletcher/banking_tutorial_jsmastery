"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { sidebarLinks } from "../constants"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"

const MobileNav = () => {

  const pathname = usePathname()

  // NOTE: We will be using shadcn sheet component here since it opens an overlay with content inside the overlay
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
            <Image 
              src="/icons/logo.svg" 
              width={34} 
              height={34} 
              alt="Horizon logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
          </Link>
          <div className="mobilenav-sheet">
            {/* NOTE: SheetClose closes the sheet if clicked inside it. Here, it means clicking any white area inside this will close it. */}
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                  console.log(pathname, item.route)
                  {/* NOTE: SheetClose closes the sheet if clicked inside it. Here, it means clicking any of the links inside this will close it. */}
                  return (
                    <SheetClose asChild key={item.label}>
                      <Link 
                        key={item.label}
                        href={item.route}
                        className={cn('mobilenav-sheet_close w-full', { 'bg-bank-gradient' : isActive } )} // A util function that merges classes. Uses twMerge under the hood.
                      >
                          <Image 
                            width={20}
                            height={20}
                            src={item.imgURL}
                            alt={item.label} 
                            className={cn({'brightness-[3] invert-0' : isActive})} // A util function that merges classes. Uses twMerge under the hood.
                          />
                          <p className={cn("text-16 font-semibold text-black-2", { "text-white": isActive }) }>
                            {item.label}
                          </p>
                      </Link>
                    </SheetClose>
                  )
                })}

                USER
              </nav>
            </SheetClose>

            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
import MobileNav from "@/MobileNav"
import Sidebar from "@/Sidebar"
import Image from "next/image"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const loggedIn = { firstName: 'Max', lastName: 'Fletcher' }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      {/* NOTE: This is the mobile sidebar */}
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu-icon" />
          <div>
            <MobileNav />
          </div>
        </div>
      {children}
      </div>
    </main>
  )
}

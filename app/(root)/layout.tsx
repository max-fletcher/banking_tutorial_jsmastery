
import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import Image from "next/image"
import { getLoggedInUser } from "../../lib/actions/user.actions"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedIn = await getLoggedInUser()
  if(!loggedIn) redirect('/sign-in') // Using redirect instead of router.push since we are in a server component

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      {/* NOTE: This is the mobile sidebar */}
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu-icon" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
      {children}
      </div>
    </main>
  )
}

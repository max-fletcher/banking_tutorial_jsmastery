import Sidebar from "@/Sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const loggedIn = { firstName: 'Max', lastName: 'Fletcher' }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      {children}
    </main>
  )
}

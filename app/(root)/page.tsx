import HeaderBox from "@/HeaderBox"

const Home = () => {
  const loggedIn = { firstName: "Fletcher" }

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting" 
            title="Welcome" 
            user={loggedIn?.firstName || "Guest"} 
            subtext="Access and manage your account and transactions efficientely."
          />
        </header>
      </div>
    </section>
  )
}

export default Home
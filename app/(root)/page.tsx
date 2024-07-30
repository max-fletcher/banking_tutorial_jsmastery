import HeaderBox from "@/HeaderBox"
import RightSidebar from "@/RightSidebar"
import TotalBalanceBox from "@/TotalBalanceBox"
import { getLoggedInUser } from "../../lib/actions/user.actions";

const Home = async () => {
  const loggedIn = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting" 
            title="Welcome" 
            user={loggedIn?.name || "Guest"} 
            subtext="Access and manage your account and transactions efficientely."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>

        RECENT TRANSACTIONS
      </div>

      <RightSidebar 
        user={loggedIn} 
        transactions={[]}
        banks={[{ currentBalance: 12.23 }, { currentBalance: 10.67 }]}
      />
    </section>
  )
}

export default Home
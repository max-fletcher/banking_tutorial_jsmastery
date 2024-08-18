import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "../../lib/actions/user.actions";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { getAccount, getAccounts } from "../../lib/actions/bank.actions";

const Home = async ({searchParams : {id, page}} : SearchParamProps) => {
  const loggedIn = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible
  const accounts = await getAccounts({userId: loggedIn.$id}); // passing loggedIn user's '$id' renamed as 'userId'

  if(!accounts) return;

  const accountsData = accounts?.data // This is to avoid repeating accounts?.data over and over again below
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId // Note that we are writing "accountsData[0]?.appwriteItemId" instead of "accounts?.data[0]?.appwriteItemId" here.
  const account = await getAccount({appwriteItemId})

  console.log('Home Page', accounts, accountsData);

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

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        RECENT TRANSACTIONS
      </div>

      <RightSidebar 
        user={loggedIn} 
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)} // An array of 2 objects that contain accountData(since we show only 2 cards in our UI)
      />
    </section>
  )
}

export default Home
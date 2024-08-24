import HeaderBox from "@/components/HeaderBox"
import { getLoggedInUser } from "@/../lib/actions/user.actions";
import { getAccounts } from "@/../lib/actions/bank.actions";
import BankCard from "@/components/BankCard";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible
  const accounts = await getAccounts({userId: loggedIn.$id}); // passing loggedIn user's '$id' renamed as 'userId'

  console.log(accounts);

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts" 
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((account: Account) => (
                <BankCard 
                  key={accounts.id}
                  account={account}
                  userName={loggedIn.firstName} 
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks
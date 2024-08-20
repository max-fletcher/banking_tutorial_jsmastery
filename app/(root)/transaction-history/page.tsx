import HeaderBox from "@/components/HeaderBox"
import { getLoggedInUser } from "@/../lib/actions/user.actions";
import { getAccount, getAccounts } from "@/../lib/actions/bank.actions";
import { formatAmount } from "@/../lib/utils";
import TransactionsTable from "@/components/TransactionsTable";

const TransactionHistory = async ({searchParams: {id, page}}: SearchParamProps) => {

  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible
  const accounts = await getAccounts({userId: loggedIn.$id}); // passing loggedIn user's '$id' renamed as 'userId'

  if(!accounts) return;

  const accountsData = accounts?.data // This is to avoid repeating accounts?.data over and over again below
  // NOTE: Notice that we are writing "accountsData[0]?.appwriteItemId" instead of "accounts?.data[0]?.appwriteItemId" here(as per the line above).
  // "appwriteItemId" corresponds to the first account belonging to the user.
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId
  const account = await getAccount({appwriteItemId})

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox title="Transaction History" subtext="See your bank details and transactions." />
      </div>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">
              {account?.data.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">{account?.data.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">{formatAmount(account?.data.currentBalance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={account?.transactions} />
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory  
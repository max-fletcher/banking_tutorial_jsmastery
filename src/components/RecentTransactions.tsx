import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from "./BankTabItem"
import BankInfo from "./BankInfo"
import TransactionsTable from "./TransactionsTable"
import { Pagination } from "./Pagination"

const RecentTransactions = ({accounts, transactions, appwriteItemId, page}: RecentTransactionsProps) => {
  const rowsPerPage = 10 // Default rowsPerPage
  const totalPages = Math.ceil(transactions.length/rowsPerPage) // Dividing all by rowsPerPage to get number of pages

  const indexOfLastTransaction = page * rowsPerPage // index of last item in the page
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage // index of first item in the page

  // NOTE: Slice and get the transactions to show in paginated component. Uses slice so I think this can be improved
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  return (
    <>
      <section className="recent-transactions">
        <header className="flex items-center justify-between">
          <h2 className="recent-transactions-label">Recent Transactions</h2>
          <Link 
            className="view-all-btn"
            href={`/transaction-history/?id=${appwriteItemId}`}
          >
            View All
          </Link>
        </header>

        {/* NOTE: Passing appwriteItemId which corresponds to the first account belonging to the user */}
        <Tabs defaultValue={appwriteItemId} className="w-full">
          <TabsList className="recent-transactions-tablist">
            { accounts.map((account: Account) => {
              return(
                <TabsTrigger key={account.id} value={account.appwriteItemId}>
                  <BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
                </TabsTrigger>
              )
            }) }
          </TabsList>

          { accounts.map((account: Account) => {
              return(
                <TabsContent 
                  key={account.id}
                  value={account.appwriteItemId}
                  className="space-y-4"
                >
                  <BankInfo 
                    account={account} 
                    appwriteItemId={appwriteItemId}
                    type="full" 
                  />

                  <TransactionsTable transactions={currentTransactions} />
                  {totalPages > 1 && (
                    <div className="my-4 w-full">
                      <Pagination totalPages={totalPages} page={page} />
                    </div>
                  )}
                </TabsContent>
              )
            }) }
        </Tabs>
      </section>
    </>
  )
}

export default RecentTransactions
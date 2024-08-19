import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "../../lib/utils"


const TransactionsTable = ({transactions}: TransactionTableProps) => {
  return (
    <>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            transactions.map((transaction: Transaction) => {
              const status = getTransactionStatus(new Date(transaction.date)) // getting the payment status for this transaction(Processing || Success). It is set to 2 days, but you are free to modify it.
              const amount = formatAmount(transaction.amount)
              const isDebit = transaction.type === "debit"
              const isCredit = transaction.type === "credit"
              return (
                <>
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <h1>{removeSpecialCharacters(transaction.name)}</h1>
                      </div>
                    </TableCell>
                    {/* NOTE: If its a debit card, amount will be -ve. Else if its a credit card, it will have a +ve value else(neither debit nor credit) it will be +ve */}
                    <TableCell>{isDebit ? `-${amount}` : isCredit ? amount : amount }</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>{formatDateTime(new Date(transaction.date)).dateTime}</TableCell>
                    <TableCell>{transaction.paymentChannel}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                  </TableRow>
                </>
              )}
            )
          }
        </TableBody>
      </Table>
    </>
  )
}

export default TransactionsTable
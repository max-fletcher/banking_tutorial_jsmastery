import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/../lib/utils"
import { transactionCategoryStyles } from "../../constants"

// NOTE: Made this component here instead of in a separate tsx file since it won't be reused anywhere else
const Categorybadge = ({category}: CategoryBadgeProps) => {
  // NOTE: Notice the type here, which indicates that this will be a type of one of the keys defined inside "transactionCategoryStyles" in "index.ts"
  const {borderColor, backgroundColor, textColor, chipBackgroundColor}
    = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
}

const TransactionsTable = ({transactions}: TransactionTableProps) => {
  return (
    <>
      <Table>
        <TableHeader className="bg-[#F9FAFB]">
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
                  <TableRow key={transaction.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none border-b-DEFAULT`}>
                    <TableCell className={`max-w-[250px] pl-2 pr-10`}>
                      <div className="flex items-center gap-3">
                        <h1 className="text-14 truncate font-semibold text-[#344054]">{removeSpecialCharacters(transaction.name)}</h1>
                      </div>
                    </TableCell>

                    {/* NOTE: If its a debit card, amount will be -ve. Else if its a credit card, it will have a +ve value else(neither debit nor credit) it will be +ve */}
                    <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}>
                      {isDebit ? `-${amount}` : isCredit ? amount : amount }
                    </TableCell>

                    <TableCell className={`pl-2 pr-10`}>
                      <Categorybadge category={status} />
                    </TableCell>

                    <TableCell className={`min-w-32 pl-2 pr-10`}>{formatDateTime(new Date(transaction.date)).dateTime}</TableCell>

                    <TableCell className={`pl-2 pr-10 capitalize min-w-24`}>{transaction.paymentChannel}</TableCell>

                    <TableCell className={`pl-2 pr-10 max-md:hidden`}>
                      <Categorybadge category={transaction.category} />
                    </TableCell>
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
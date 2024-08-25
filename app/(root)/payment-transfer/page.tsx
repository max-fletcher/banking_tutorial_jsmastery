import HeaderBox from "@/components/HeaderBox"
import PaymentTransferForm from "@/components/PaymentTransferForm"
import { getLoggedInUser } from "@/../lib/actions/user.actions";
import { getAccounts } from "@/../lib/actions/bank.actions";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible
  const accounts = await getAccounts({userId: loggedIn.$id}); // passing loggedIn user's '$id' renamed as 'userId'

  if(!accounts) return;

  const accountsData = accounts?.data // This is to avoid repeating accounts?.data over and over again below

  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer." 
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer
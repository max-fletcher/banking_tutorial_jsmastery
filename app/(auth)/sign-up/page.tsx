import AuthForm from "@/AuthForm"
import { getLoggedInUser } from "@/../lib/actions/user.actions";

const SignUp = async () => {
  const loggedInUser = await getLoggedInUser(); //NOTE: Calling this here since calling it inside AuthForm(i.e a client component) is not possible
  console.log('henlo', loggedInUser);

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  )
}

export default SignUp
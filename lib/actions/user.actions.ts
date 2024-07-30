// NOTE: 'use server' here causes all function here to become server actions
'use server'

import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

export const signIn = async ({email, password}: signInProps) => { // Directly destructuring the varaibles that we get as params
  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password)
    return parseStringify(response)
  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData

  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    // the "appwrite-session" can be replaced with any other name, but it has to be the same as the name used in appwrite.ts
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // NOTE: The reason we are using this "parseStringify" function is because in Next JS, we can't pass large objects via server actions so we are stringifying it first
    return parseStringify(newUserAccount)
  } catch (error) {
    console.error('Error', error);
  }
}

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    // NOTE: The reason we are using this "parseStringify" function is because in Next JS, we can't pass large objects via server actions so we are stringifying it first
    return parseStringify(user)
  } catch (error) {
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session');
    await account.deleteSession('current') // To close current session client
  } catch (error) {
    return null;
  }
}

// NOTE: 'use server' here causes all function here to become server actions
'use server'

import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

export const signIn = async (userData: LoginUser) => {
  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
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
    return await account.get();
  } catch (error) {
    return null;
  }
}

// NOTE: using server actions here so we are using 'use server'
'use server'

import { createSessionClient } from "../appwrite";

export const signIn = async (userData: LoginUser) => {
  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async (userData: SignUpParams) => {
  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
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

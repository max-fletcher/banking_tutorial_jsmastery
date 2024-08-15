// NOTE: 'use server' here causes all function here to become server actions
'use server'

import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// NOTE Fetch env variables instead of using say process.env.APPWRITE_DATABASE_ID everytime
const {
  APPWRITE_DATABASE_ID: DATABASE_ID, // We are renaming the env variable here
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID, // We are renaming the env variable here
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID, // We are renaming the env variable here
} = process.env

export const signIn = async ({email, password}: signInProps) => { // Directly destructuring the varaibles that we get as params
  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
    const { account } = await createAdminClient();
    console.log('account', account);
    const response = await account.createEmailPasswordSession(email, password)
    console.log('sign in response', response);
    return parseStringify(response)
  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData

  let newUserAccount;

  try {
    // NOTE: in server actions, we do Mutations|Database Operation|Fetch Request
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )

    if(!newUserAccount) throw new Error('Error creating user')

    const dwollaCustomerUrl = await createDwollaCustomer({...userData, type: 'personal'})

    if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer ')

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

    console.log('before creating new user', userData, newUserAccount.$id, dwollaCustomerId, dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!, // 1st param - ID of the database where we are storing the data
      USER_COLLECTION_ID!, // 2nd param - ID of the collection/table where we are storing the data
      ID.unique(), // 3rd param - generate a unique ID to use as primary key,
      {            // 4th param - Object containing all the data we are storing to each column in the correct sequence
        ...userData, userId: newUserAccount.$id, dwollaCustomerId, dwollaCustomerUrl // Some of the keys here are not renamed. May need to do that later.
      }
    )

    const session = await account.createEmailPasswordSession(email, password)

    // the "appwrite-session" can be replaced with any other name, but it has to be the same as the name used in appwrite.ts
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })

    // NOTE: The reason we are using this "parseStringify" function is because in Next JS, we can't pass large objects via server actions so we are stringifying it first
    return parseStringify(newUser)
  } catch (error) {
    console.error('Error', error)
  }
}

export async function getLoggedInUser() { // This needs to be a normal function for some reason
  try {
    const { account } = await createSessionClient()
    const user = await account.get()

    // NOTE: The reason we are using this "parseStringify" function is because in Next JS, we can't pass large objects via server actions so we are stringifying it first
    return parseStringify(user)
  } catch (error) {
    return null
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session')
    await account.deleteSession('current') // To close current session client
  } catch (error) {
    return null
  }
}

export const createLinkToken = async (user: User) => { // Calls and requests a token from plaid
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: user.name,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams) // plaidClient comes from plaid.ts

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error)
    
  }
}

export const createBankAccount = async ({ userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId }: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient() // establish client connection with appwrite DB
    const bankAccount = await database.createDocument( // Storing data to the BANK_COLLECTION collection/table in appwrite
      DATABASE_ID!, // 1st param - ID of the database where we are storing the data
      BANK_COLLECTION_ID!, // 2nd param - ID of the collection/table where we are storing the data
      ID.unique(), // 3rd param - generate a unique ID to use as primary key,
      {            // 4th param - Object containing all the data we are storing to each column in the correct sequence
        userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId 
      }
    )

    return parseStringify(bankAccount)
  } catch (error) {
    
  }
}

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({ // exchange out a public token for an access token
      public_token: publicToken
    })

    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    const accountsResponse = await plaidClient.accountsGet({ // get account info from Plaid using the access token
      access_token: accessToken
    })

    const accountData = accountsResponse.data.accounts[0] // store first account data only

    // using Dwolla to process payments
    const request : ProcessorTokenCreateRequest = { // Create a processor token for Dwolla using the access_token and account ID. This will be used by plaid to process payments.
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    }

    const ProcessorTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = ProcessorTokenResponse.data.processor_token

    const fundingSourceUrl = await addFundingSource({ // Create a finding source URL for the account using the Dwolla customer ID, processor token and bank name
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name
    })

    if(!fundingSourceUrl) throw Error

    await createBankAccount({ // Create a bank account using the user ID, item ID, account Id, access token, funding source URL and shareable ID
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    })

    revalidatePath('/') // Revalidate the path to reflect the changes. Allows us to purge data for that route and see the changes done after runnign this function on that route(i.e homepage in this case).
    return parseStringify({
      publicTokenExchange: "complete"
    })

  } catch (error) {
    console.log("An error occured while creating exchange tokens", error);
  }
}
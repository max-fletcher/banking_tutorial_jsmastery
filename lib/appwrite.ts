// NOTE: These are server actions. Although we are using server actions inside the actions folder, we have chosen to keep this here.
"use server";
import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";

// NOTE: Gaining access to an appwrite project via using the appwrite client and a local session that uses cookies. As long as the session persists,
// this can be used to access feature's APIs that require permission.
export async function createSessionClient() {
  // NOTE: The exclamation mark at the end of the env variables is to mitigate typescript errors
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // "appwrite-session" can be replaced with another name, but then we have to use the same cookie/session name across the entire app where this cookie is used
  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// NOTE: Does the same thing as above but with increased privileges. Gaining access to an appwrite project via using the appwrite client and an extra key called "NEXT_APPWRITE_KEY".
// This doesn't use a session so it can be used whenever and however we want to access all feature's APIs that require permission. Since we already set all permission to true,
// we should be able to use all features using their APIs.
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    // NOTE: We are choosing to return a database instance
    get database() {
      return new Databases(client)
    }
  };
}

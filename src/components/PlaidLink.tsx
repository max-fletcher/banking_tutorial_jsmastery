"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from "next/navigation"
import { createLinkToken, exchangePublicToken } from "../../lib/actions/user.actions"
import Image from "next/image"

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()
  const [token, setToken] = useState('')

  // NOTE: Never make the function (i.e 1st dependency) in useEffect async. You can make any inner function async but not the outer one.
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)
      setToken(data?.linkToken)
    }

    getLinkToken() // calling the function after creating it
  }, [user]);

  // NOTE: Using a useCallback since we don't want to recall this on every re-render. Note the type def here as well.
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user
      })

      router.push('/')
    }, [user]
  )

  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <>
      {variant === 'primary' ? (
          <Button
            onClick={() => open()} // Not using a callback causes this to throw a typescript error
            disabled={!ready} // Disabled if not ready
            className="plaidlink-primary"
          >
            Connect Bank
          </Button> 
        ) 
        : variant === 'ghost' ? 
          (
            // NOTE: Button with ghost button style
            <Button
              onClick={() => open()} // Not using a callback causes this to throw a typescript error
              variant="ghost"
              className="plaidlink-ghost"
            >
              <Image 
                src="/icons/connect-bank.svg"
                alt="connect bank"
                width={24}
                height={24} 
              />
            {/* NOTE: this p tag will be hidden unless screen size will be xl as  signified by the "hidden xl:block" classes */}
            <p className="hidden xl:block text-[16px] font-semibold text-black-2">Connect Bank</p>
            </Button> 
          )
          :
          // NOTE: Button with default button style
          <Button
            onClick={() => open()} // Not using a callback causes this to throw a typescript error
            className="plaidlink-default"
          >
            <Image 
              src="/icons/connect-bank.svg"
              alt="connect bank"
              width={24}
              height={24} 
            />
            <p className="text-[16px] font-semibold text-black-2">Connect Bank</p>
          </Button>
      }
    </>
  )
}

export default PlaidLink
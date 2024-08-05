"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from "next/navigation"

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()
  const [token, setToken] = useState('')

  // NOTE: Never make the function (i.e 1st dependency) in useEffect async. You can make any inner function async but not the outer one.
  useEffect(() => {
    const getLinkToken = async () => {
      // const data = await createLinkToken(user)
      // setToken(data?.linkToken)
    }

    getLinkToken()
  }, []);

  // NOTE: Using a useCallback since we don't want to recall this on every re-render. Note the type def here as well.
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      // await exchangePublicToken({
      //   publicToken: public_token,
      //   user
      // })

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
          <Button className="plaidlink-primary">
            Connect Bank
          </Button> 
        ) 
        : variant === 'ghost' ? 
          (
            <Button>
              Connect Bank
            </Button> 
          )
          :
          <Button>
            Connect Bank
          </Button> 
      }
    </>
  )
}

export default PlaidLink
// Chart JS only works for client components so we sre using this here
"use client"
import CountUp from "react-countup"

const AnimatedCounter = ({amount}: {amount: number}) => {
  return (
    <div className="w-full">
      <CountUp
        decimals={2}
        decimal="."
        prefix="$"
        end={amount}
      />
    </div>
  )
}

export default AnimatedCounter
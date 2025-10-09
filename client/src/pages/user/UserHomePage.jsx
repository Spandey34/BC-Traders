import { SignedIn, UserButton } from '@clerk/clerk-react'
import React from 'react'

const UserHomePage = () => {
  return (
    <div>
      Hello there!!
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default UserHomePage

import { SignedIn, UserButton } from '@clerk/clerk-react'
import React from 'react'

const AdminHomePage = () => {
  return (
    <div>
      AdminPage
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default AdminHomePage

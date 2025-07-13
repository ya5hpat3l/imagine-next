import {
    ClerkProvider,
    SignIn,
    SignUp,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export default function SignUpPage(){
  return (
    <div className='w-full flex justify-center items-center'>
      <SignUp routing="hash" fallbackRedirectUrl="/dashboard" />
    </div>
  )
}
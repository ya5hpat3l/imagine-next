import {
    ClerkProvider,
    SignIn,
    SignUp,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export default function SignInPage(){
  return (
    <div className='w-full flex justify-center items-center'>
      <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
    </div>
  )
}
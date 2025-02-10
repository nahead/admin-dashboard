'use client'
import AdminLogin from "./admin/page";
// import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";


export default function Home() {
  // const {user}= useUser()
  // const router = useRouter()
  // if (user && user.primaryEmailAddress?.emailAddress === 'gplaying780@gmail.com'){
  //   router.push('/admin/dashboard') 
  // }
  return (
  <div >
    <AdminLogin/>
    {/* <h1> 
      Admin Login
    </h1>
    <SignedOut>
      <SignInButton>
        Sign In
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <SignOutButton>
        Sign Out
      </SignOutButton>
    </SignedIn> */}
  </div>
  );
}

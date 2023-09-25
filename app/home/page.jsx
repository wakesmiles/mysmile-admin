'use client'
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import Defaultpage from "../components/default"
import Navbar from "../components/navbar"
import UnAuthorizedPage from "../components/unauth"
import {FetchUser} from "../components/unauth"
import Loading from "../loading"

import "../../styles/homepage.css"


export default function Home() {
  const router = useRouter()
  const [user, loading] = FetchUser();
  if (loading) {
    return <Loading />
  } else if (!user) {
    return <UnAuthorizedPage />
  }


  const logout = async () => {
    let success = false
    await supabase.auth.signOut().then(() => {
      success = true
    })
    if (success) router.push("/")
  }

  // NOTE: According to https://stackoverflow.com/questions/66729498/next-js-is-not-rendering-css-in-server-side-rendering
  // If you are not in production, the CSS/styles will not be loaded on the first fetch (refresh to see)

  return (
    <div className="flex flex-col">
      
      <Navbar logout={logout} />

      <Defaultpage />

    </div>
  )
}

'use client'
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import Defaultpage from "../components/default"
import Navbar from "../components/navbar"
import UnAuthorizedPage from "../components/unauth"
import { useState,  } from "react"
import Loading from "../loading"

import "../../styles/homepage.css"

function fetchUser() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  supabase.auth.getUser().then(async (data, err) => {
    if (!data.data.user) {
      setLoading(false)
      return data.data.user
    }
    const id = data.data.user.id
    await supabase.from('admins')
    .select()
    .eq("id", id)
    .then((admin, err) => {
      if (admin) {
        setUser(admin);
        setLoading(false)
      }
    })
  })
  return [user, loading];
}

export default function Home() {
  const router = useRouter()
  const [user, loading] = fetchUser();
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

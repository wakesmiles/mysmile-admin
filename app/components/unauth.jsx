import { useState } from "react"
import { supabase } from "../../supabaseClient"
import Link from "next/link"
import { purple } from "@mui/material/colors"

export function FetchUser() {
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

/** Intermediate UI for attempting to load page while unauthenticated */
export default function UnAuthorizedPage() {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
          <div className="flex flex-col text-center">
            <h1>No user data... invalid/expired session or restricted access.</h1>
            <div className="font-medium hover:underline hover:underline-offset-4" >
              <Link style={{color: '#9654ba' }} href="/">Click here to sign in or make an account.</Link>
            </div>
          </div>
      </div>
    )
}
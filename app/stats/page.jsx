'use client'
import Navbar from "../components/navbar"
import Stats from "../components/stats"
import Loading from "../loading"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import UnAuthorizedPage from "../components/unauth"

import "../../styles/defaultpage.css"

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

export default function StatsPage() {
    const [user, loading] = fetchUser()
    const router = useRouter()
    const [signups, setSignups] = useState(null)
    const [shifts, setShifts] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchSignups = async () => {
        await supabase
          .from("signups")
          .select()
          .then((signups, err) => {
            if (signups) {
              setSignups(signups)
            } else {
              console.log("error in signups")
            }
        })
    }
    
    const fetchShifts = async () => {
        await supabase
          .from("shifts")
          .select()
          .then((shifts, err) => {
            if (shifts) {
              setShifts(shifts)
            } else {
              console.log("error in shifts")
            }
        })
    }
    
    useEffect(() => { // Get all table information at once (delete this once the methods here can be moved to server-side rendering)
        const fetchTables = async () => {
          try {
            setIsLoading(true)
            fetchSignups()
            fetchShifts()
          } catch (err) {
            console.log("caught error")
          } finally {
            setIsLoading(false)
          }
        }
        fetchTables()
    }, [])

    const logout = async () => {
        let success = false
        await supabase.auth.signOut().then(() => {
          success = true
        })
        if (success) router.push("/")
    }

    if (isLoading || !signups || !shifts || loading) { // If even one thing hasn't been loaded yet...
      return <Loading />
    } else if (!user) {
      return <UnAuthorizedPage />
    }
    return (
        <div className="flex flex-col">
            <Navbar logout = {logout} />
            <div className="">
                <Stats signups={signups} shifts={shifts} />
            </div>
        </div>
    )
}
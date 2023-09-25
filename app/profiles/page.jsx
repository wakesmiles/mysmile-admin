'use client'
import Navbar from "../components/navbar"
import Profiletable from "../components/profiletable"
import Loading from "../loading"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import UnAuthorizedPage from "../components/unauth"
import { FetchUser } from "../components/unauth"

import "../../styles/defaultpage.css"

export default function ProfilesPage() {
    const router = useRouter()
    const [user, loading] = FetchUser()
    const [signups, setSignups] = useState(null)
    const [people, setPeople] = useState(null)
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

    const fetchProfiles = async () => {
        await supabase
          .from("profiles")
          .select()
          .then((profiles, err) => {
            if (profiles) {
              setPeople(profiles)
            } else {
              console.log("error in profiles")
            }
          })
      }
    
    useEffect(() => { // Get all table information at once (delete this once the methods here can be moved to server-side rendering)
        const fetchTables = async () => {
          try {
            setIsLoading(true)
            fetchProfiles()
            fetchSignups()
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

    if (isLoading || !signups || !people || loading) { // If even one thing hasn't been loaded yet...
      return <Loading />
    } else if (!user) {
      return <UnAuthorizedPage />
    }
    return (
        <div className="flex flex-col">
            <Navbar logout = {logout} />
            <div className="">
                <Profiletable signups={signups} profiles={people} />
            </div>
        </div>
    )
}
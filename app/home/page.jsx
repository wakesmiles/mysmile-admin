'use client'
import { supabase } from "../../supabaseClient"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import Loading from "../loading"
import Profiletable from "../components/profiletable"
import Signuptable from "../components/signuptable"
import Shiftstable from "../components/shiftstable"
import Defaultpage from "../components/default"
import Navbar from "../components/navbar"
import Stats from "../components/stats"

import "../../styles/homepage.css"

export default function Home() {
  const [people, setPeople] = useState(null)
  const [signups, setSignups] = useState(null)
  const [shifts, setShifts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState("None")
  const router = useRouter()

  // For the future, fetchProfiles(), fetchSignups(), and fetchShifts() should be moved to another file 
  // that is NOT a client component, so they can be rendered on server instead of all on client

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
        fetchProfiles()
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

  if (isLoading || !people || !signups || !shifts) { // If even one thing hasn't been loaded yet...
    return <Loading />
  }

  // NOTE: According to https://stackoverflow.com/questions/66729498/next-js-is-not-rendering-css-in-server-side-rendering
  // If you are not in production, the CSS/styles will not be loaded on the first fetch (refresh to see)

  return (
    <div className="flex flex-col">
      
      <Navbar setContent={setContent} logout={logout}/>

      <div className="">
        {content === "None" && <Defaultpage />}
        {content === "Stats" && <Stats signups={signups} shifts={shifts}/>}
        {content === "Profiles" && <Profiletable profiles={people} signups={signups}/>}
        {content === "Signups" && <Signuptable profiles={people} signups={signups} shifts={shifts} />}
        {content === "Shifts" && <Shiftstable signups={signups} shifts={shifts} />}
      </div> 

    </div>
  )
}

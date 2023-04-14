'use client'
import { supabase } from "../../supabaseClient"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import Reroute from "../components/reroute"
import Loading from "../loading"
import Profiletable from "../components/profiletable"
import Signuptable from "../components/signuptable"
import Shiftstable from "../components/shiftstable"
import Defaultpage from "../components/default"
import Navbar from "../components/navbar"
import Stats from "../components/stats"

import "../../styles/homepage.css"

export default function Home() {
  const [user, setUser] = useState(null)
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
        setIsLoading(true);
        await supabase.auth.getUser().then(async (data, err) => { // Check if the user is an admin
          if (data) {
            await supabase
              .from("admins")
              .select()
              .eq("id", data.data.user.id)
              .then((admin, err) => {
                if (admin.data.length !== 0) { // check if logged in user is registered in the admin table
                  // console.log("this user is an admin")
                  setUser(admin)
                } else {
                  // console.log("this user is not an admin")
                }
              })
          }
        })
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

  if (!user) { // Send the user here if they are not admin
    return <Reroute />
  }

  // NOTE: According to https://stackoverflow.com/questions/66729498/next-js-is-not-rendering-css-in-server-side-rendering
  // If you are not in production, the CSS/styles will not be loaded on the first fetch (refresh to see)

  return (
    <div className="flex flex-col">
      
      <Navbar setContent={setContent} logout = {logout}/>

      <div className="">
        {content === "None" && <Defaultpage />}
        {content === "Profiles" && <Profiletable profiles={people} />}
        {content === "Signups" && <Signuptable profiles={people} signups={signups} shifts={shifts} />}
        {content === "Shifts" && <Shiftstable signups={signups} shifts={shifts} />}
        {content === "Stats" && <Stats signups={signups} shifts={shifts}/>}
      </div> 

    </div>
  );
}

'use client'
import { supabase } from "../../supabaseClient"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import Reroute from "../components/reroute"
import Loading from "../loading"
import Profiletable from "../components/profiletable"
import Signuptable from "../components/signuptable"
import Shiftstable from "../components/shiftstable"
import Navbar from "../components/navbar"
import "../../styles/homepage.css"

export default function Home() {
  const [user, setUser] = useState(null)
  const [people, setPeople] = useState(null)
  const [signups, setSignups] = useState(null)
  const [shifts, setShifts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState("None")
  const router = useRouter()

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
      .then(console.log("this is profiles"))
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
      .then(console.log("this is signups"))
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
      .then(console.log("this is shifts"))
  }

  useEffect(() => { // Get all table information at once
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
                if (admin.data.length !== 0) {
                  // checks if logged in user is registered in the admin table
                  console.log("this user is an admin")
                  setUser(admin)
                } else {
                  console.log("this user is not an admin")
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

  if (isLoading || !people || !signups || !shifts) { // 한 가지라도 로드 안 됐으면...
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
        {content === "Profiles" && <Profiletable profiles={people} />}
        {content === "Signups" && <Signuptable signups={signups} shifts={shifts} />}
        {content === "Shifts" && <Shiftstable signups={signups} shifts={shifts} />}
      </div> 

    </div>
  );
}

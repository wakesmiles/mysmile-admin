'use client'
import Navbar from "../components/navbar"
import Shiftstable from "../components/shiftstable"
import Loading from "../loading"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"

import "../../styles/defaultpage.css"


export default function ShiftsPage() {

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

    if (isLoading || !signups || !shifts) { // If even one thing hasn't been loaded yet...
        return <Loading />
    }
    return (
        <div className="flex flex-col">
            <Navbar logout = {logout} />
            <div className="">
                <Shiftstable signups={signups} shifts={shifts} />
            </div>
        </div>
    )
}
'use client'
import Navbar from "../components/navbar"
import Loading from "../loading"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import UnAuthorizedPage from "../components/unauth"
import FoldersTable from "../components/folderstable"
import { FetchUser } from "../components/unauth"
import React from "react";
import "../../styles/defaultpage.css"

export default function FilesPage() {
  const router = useRouter()
  const [user, userLoading] = FetchUser()
  const [folders, setFolders] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchFolders = async () => {
    await supabase
    .storage
    .from('certifications')
    .list('', {
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    }).then((data, err) => {
      if (data) {
        setFolders(data.data);
      }
    })
  }

  useEffect(() => { // Get all table information at once (delete this once the methods here can be moved to server-side rendering)
    const fetchTables = async () => {
      try {
        setIsLoading(true)
        fetchFolders()
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

  if (userLoading || !folders || isLoading) {
    return <Loading />
  } else if (!user) {
    return <UnAuthorizedPage />
  }

  return (
    <div className="flex flex-col">
      <Navbar logout={logout}/>
      <FoldersTable folders={folders} />
    </div>
  )
}
  
'use client'
import { useState, useEffect } from "react";
import UnAuthorizedPage from "@/app/components/unauth";
import Loading from "@/app/loading";
import { FetchUser } from "@/app/components/unauth";
import Navbar from "@/app/components/navbar";
import { supabase } from "@/supabaseClient";
import FilesTable from "@/app/components/filestable";

export default function FilePage({params}) {
    const [user, userLoading] = FetchUser()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchFiles = async () => {
        await supabase.storage
        .from("certifications")
        .list(params.folderName, {
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        })
        .then((data) => {
          if (data) {
            setFiles(data.data);
          }
        });
    }



    useEffect(() => { // Get all table information at once (delete this once the methods here can be moved to server-side rendering)
        const fetchTables = async () => {
          try {
            setIsLoading(true)
            fetchFiles()
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

    if (userLoading || isLoading || !files) {
        return <Loading />
    } else if (!user) {
        return <UnAuthorizedPage />
    }

    return (
        <div className="flex flex-col">
            <Navbar logout={logout}/>
            <FilesTable filesInit={files} folder={params.folderName} />
        </div>
    )
}
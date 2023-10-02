'use client'
import Navbar from "../components/navbar"
import Filestable from "../components/filestable"
import Loading from "../loading"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useRouter } from "next/navigation"
import UnAuthorizedPage from "../components/unauth"
import { FetchUser } from "../components/unauth"
import React from "react";
import "../../styles/defaultpage.css"

console.log("Rendering FilesPage component");

export default function FilesPage() {
    const router = useRouter();
    const [user, userLoading] = FetchUser();
    const [isLoading, setIsLoading] = useState(false); // set default to true
    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);
  
    const fetchUsersAndFiles = async () => {
      try {
        const response = await fetch("/api/getUsersAndFiles");
        if (!response.ok) {
          throw new Error("Failed to fetch users and files.");
        }
        const data = await response.json();
        setUsers(data); // set data to users state
        setIsLoading(false); // set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching users and files:", error.message);
        setIsLoading(false); // set loading to false in case of error
      }
    };
  
    useEffect(() => {
        const fetchFiles = async () => {
            const { data, error } = await supabase.from('files').select('*');
            console.log("Fetched files from Supabase:", data);  // Add this line
            if (error) {
                console.error('Error fetching files:', error.message);
            } else {
                setFiles(data);
            }
        };
    
        fetchFiles();
    }, []);
    
    if (userLoading || isLoading) {  
      return <Loading />
    } else if (!user) {
      return <UnAuthorizedPage />
    }
  
    return (
        <div>
        <h1>Admin Files</h1>
        <ul>
            {files.map(file => (
                <li key={file.id}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.name}
                    </a>
                </li>
            ))}
        </ul>
    </div>    
    );
  }
  
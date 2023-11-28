import Link from "next/link"
import { useRef, useState } from "react"
import FolderIcon from '@mui/icons-material/Folder';
import { Container } from "@mui/material";

const FoldersTable = ({ folders }) => {
    const searchRef = useRef("")
    const [useFolders, setUseFolders] = useState(folders);
    const searchChange = async () => {
        if (searchRef.current.value != '') {
            setUseFolders(folders.filter((folder => folder.name.replace(/_/g, ' ').slice(0, -6).toLowerCase().startsWith(searchRef.current.value.toLowerCase()))))
        } else {
            setUseFolders(folders);
        }
    }
    return (
        <div className="">
            <div className="container p-10">
                <div className="shadow w-4/5 border-transparent bg-neutral-900 border-2 border-neutral-800 rounded-t-xl px-5 pt-5">
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative pb-5">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pb-5">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" ref={searchRef} id="default-search" onChange={searchChange} class="shadow bg-neutral-900 block w-full p-4 pl-10 text-sm text-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Folders" />
                    </div>
                </div>
                <div className="shadow max-h-[35rem] w-4/5 overflow-y-scroll border-transparent bg-neutral-900 border-2 border-neutral-800 grid-cols-2 px-5 py-5 rounded-b-xl">
                    {useFolders.map((folder, index) => (
                        <div className="py-1" key={index}>
                            <Link href={`files/${folder.name}`}>
                                <div className="block border-2 border-neutral-700 border-transparent rounded-md max-w-2/3">
                                    <FolderIcon sx={{ padding: "5px", color: "white", fontSize: "25pt"}} />
                                    <a className="text-base text-white">{folder.name.replace(/_/g, ' ').slice(0, -6)}</a>
                                </div>  
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FoldersTable;

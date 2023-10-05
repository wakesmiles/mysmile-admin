import Link from "next/link"
import FolderIcon from '@mui/icons-material/Folder';

const FoldersTable = ({ folders }) => {
    return (
        <div className="default-bg-img">
            <div className="overflow-auto flex justify-center backdrop-blur-xl rounded-xl text-white p-7 border border-[#00539b]">
                <div className="flex flex-col px-6">
                    <h2 className="flex justify-center text-lg">Folders</h2>
                    <div className="grid-cols-2">
                        {folders.map(folder => (
                            <div className="py-3">
                                <FolderIcon sx={{ color: "white", fontSize: "25pt"}} />
                                <Link className="text-lg text-white" href={`files/${folder.name}`}>{folder.name.replace(/_/g, ' ').slice(0, -5)}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoldersTable;
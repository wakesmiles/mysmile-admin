import { useState } from "react";
import { supabase } from "@/supabaseClient";
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from "file-saver";

const FilesTable = ({ filesInit, folder }) => {
    const [files, setFiles] = useState(filesInit)

    const formatDate = (date) => {
        return `${date.slice(5, 7)}/${date.slice(8, 10)}/${date.slice(0, 4)}`;
    };
    
      /**
       * Download file into local directory from Supabase storage
       */
      const downloadFile = async (e, name) => {
        e.preventDefault();
        try {
          await supabase.storage
            .from("certifications")
            .download(folder + "/" + name)
            .then((data, error) => {
              if (data) {
                saveAs(data.data, name); // Saves BLOB to local disk with File Saver
              } else if (error) {
                console.log("SOMETHING WRONG");
                console.log(error);
              }
            });
        } catch (e) {
          console.log("download error");
          console.log(e);
        }
    };
    return (
        <div>
        <div className="flex flex-row">
          <div className="container p-10">
            <div className="shadow sm:rounded-lg w-4/5 border-transparent dark:bg-neutral-900 dark:border-2 dark:border-neutral-800">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-white">{`${folder.replace(/_/g, ' ').slice(0, -6)}'s Files`}</h2>
              </div>
              <div className="border-t border-gray-200 p-6  dark:border-neutral-800">
                <div className="overflow-y-scroll overflow-x-hidden w-full h-full max-w-full max-h-72 pr-5">
                  <table className="orientation-shifts mt-5 w-full">
                    <thead className="mb-5 border-b border-gray-200 dark:border-neutral-800">
                      <tr className="grid w-full grid-cols-5 text-left mb-2 dark:text-neutral-200">
                        <th className="col-span-3 text-white font-medium">Uploaded</th>
                        <th className="col-span-1 text-white font-medium">Date</th>
                        <th className="col-span-1 text-white font-medium w-5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.length > 0 ? (
                        files.map((f, i) => {
                          return (
                            <tr key={i} className="grid grid-cols-5 mt-2 text-sm">
                              <td className="col-span-3 truncate text-white">{f.name}</td>
                              <td className="col-span-1 text-white">
                                {formatDate(f.created_at.slice(0, 10))}
                              </td>
                              <td className="col-span-1 flex flex-row justify-end gap-4">
                                <button
                                  className="w-5 h-5 text-indigo-600"
                                  onClick={(e) => downloadFile(e, f.name)}
                                >
                                    <DownloadIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="grid grid-cols-5 mt-2 text-sm dark:text-neutral-200">
                          <td className="col-span-5 text-white">No files uploaded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default FilesTable
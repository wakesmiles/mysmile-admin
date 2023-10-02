'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

const Filestable = () => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                console.log(data)
                const { data, error } = await supabase.storage.from('my-bucket').list('');
                if (error) throw error;
                setFileList(data);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h2 style={{ color: 'white' }}>Admin Files</h2>
            <table>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>File URL</th>
                    </tr>
                </thead>
                <tbody>
                    {fileList.map(file => (
                        <tr key={file.name}>
                            <td>{file.name}</td>
                            <td>
                                <a 
                                    href={`${supabase.storage.getPublicUrl('my-bucket', file.name)}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View File
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Filestable;

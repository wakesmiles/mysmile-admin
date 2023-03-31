'use client'
import { useMemo } from 'react'
import MaterialReactTable from "material-react-table";

import '../../styles/table.css'

const Profiletable = ( {profiles} ) => {
    
    // 원래 받던 데이타에서 오리엔테이션 필드가 boolean 인데, string 으로 바꿔야 테이블에 나타난다
    const profiles_oriented = profiles.data.map(obj => {
      return {...obj, orientation: obj.orientation.toString()} 
    })

    const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
      () => [
        {
          accessorKey: 'first_name', 
          header: 'First Name',
        },
        {
          accessorKey: 'last_name',
          header: 'Last Name',
        },
        {
          accessorKey: 'email', 
          header: 'Email',
        },
        {
          accessorKey: 'phone',
          header: 'Phone',
        },
        {
          accessorKey: 'city',
          header: 'City',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'zip',
          header: 'Zip'
        },
        {
          accessorKey: 'orientation',
          header: 'Oriented',
        }
      ],
      [],
    );

    return (
      <div>
        <h2>Profiles Table</h2>
        <MaterialReactTable columns={columns} data={profiles_oriented} />
      </div>
    )
}

export default Profiletable
'use client'
import { useMemo } from 'react'
import MaterialReactTable from "material-react-table";

import '../../styles/table.css'

const Shiftstable = ( {signups, shifts} ) => {

    const data = []
    const signup_data = signups.data
    const shifts_data = shifts.data

    shifts_data.forEach(shift => {  // 데이터 정리
        let obj = {}
        obj.type = shift.shift_type.toUpperCase()
        obj.date = shift.shift_date
        obj.start_time = shift.start_time
        obj.end_time = shift.end_time
        obj.remaining_slots = shift.remaining_slots
        
        let volunteers = []
        volunteers = signup_data.filter(signup => signup.shift_id === shift.id)
        if (volunteers.length === 0) {
            obj.email_1 = ""
            obj.email_2 = ""
        } else if (volunteers.length === 1) {
            obj.email_1 = volunteers[0].email
            obj.email_2 = ""
        } else {
            obj.email_1 = volunteers[0].email
            obj.email_2 = volunteers[1].email
        }

        data.push(obj)
    })

    console.log(data)

    const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
        () => [
            {
                accessorKey: 'type', 
                header: 'Shift Type',
            },
            {
                accessorKey: 'date',
                header: 'Shift Date',
            },
            {
                accessorKey: 'start_time', 
                header: 'Start Time',
            },
            {
                accessorKey: 'end_time',
                header: 'End Time',
            },
            {
                accessorKey: 'email_1',
                header: 'Email 1',
            },
            {
                accessorKey: 'email_2',
                header: 'Email 2',
            },
            {
                accessorKey: 'remaining_slots',
                header: 'Rem. Slots'
            },
        ],
        [],
    );

    return (
        <div>
            <h2>Shifts Table</h2>
            <MaterialReactTable columns={columns} data={data} />;
        </div>
    )
}

export default Shiftstable
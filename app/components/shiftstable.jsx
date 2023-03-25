'use client'
import { useMemo } from 'react'
import MaterialReactTable from "material-react-table";

import '../../styles/profiletable.css'

const Shiftstable = ( {signups, shifts} ) => {

    const data = []
    const signup_data = signups.data
    const shifts_data = shifts.data

    shifts_data.forEach(shift => {
        let obj = {}
        obj.type = shift.shift_type
        obj.date = shift.shift_date
        obj.start_time = shift.start_time
        obj.end_time = shift.end_time
        
        let volunteers = []
        volunteers = signup_data.filter(signup => signup.shift_id === shift.id)
        obj.volunteers = volunteers
        data.push(obj)
    })

    console.log(data)

    return (
        <div>
            <h2>Shifts Table</h2>
            <table>
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Rem. Slots</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.data.map((shift) => (
                    <>
                        <tr key={shift.id}>
                        <td>{shift.shift_date}</td>  {/*} put the custom sort function */}
                        <td>{shift.shift_type}</td>
                        <td>{shift.start_time}</td>
                        <td>{shift.end_time}</td>
                        <td>{shift.remaining_slots}</td>
                        </tr>
                    </>
                    ))}
                </tbody>
            </table>
      </div>
    )
}

export default Shiftstable
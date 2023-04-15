import { useState } from "react"

export default function Stats({signups, shifts}) {

    const [allSignups, setAllSignups] = useState(signups.data)  // these 2 are the data used for searching
    const [allShifts, setAllShifts] = useState(shifts.data)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [searchFrom, setSearchFrom] = useState("")  // start search from this date
    const [searchTo, setSearchTo] = useState("")
    
    const [displayVolunteerTime, setDisplayVolunteerTime] = useState("")

    const handleFetchUserReports = () => {
        let filteredSignups = allSignups
        if (firstName && lastName) {  // if name provided, filter signups for name provided, else don't
            filteredSignups = allSignups.filter(signup => signup.first_name.toLowerCase() === firstName.toLowerCase() && signup.last_name.toLowerCase() === lastName.toLowerCase()) 
        }
        
        // convert provided string into date object for easier searching
        let searchFromDateObj = Date.parse(searchFrom)
        let searchToDateObj = Date.parse(searchTo)

        // take care of incomplete date things to get all if not provided
        if (searchFrom === "" && searchTo === "") {
            searchFromDateObj = Date.parse("2020-01-01")
            searchToDateObj = Date.parse("2050-01-01")
        } else if (searchFrom === "") {
            searchFromDateObj = Date.parse("2020-01-01")
        } else if (searchTo === "") {
            searchToDateObj = Date.parse("2050-01-01")
        }

        let search_for_these_shift_ids = filteredSignups.map(su => su.shift_id)  // extract shift_ids to search for
        
        for (let i = 0; i < filteredSignups.length; i++) {  // extract shift dates for each date in search_for_these_ids
            let date_for_this_shift = allShifts.filter(shift => shift.id === search_for_these_shift_ids[i])[0].shift_date
            filteredSignups[i] = {...filteredSignups[i], shift_date: Date.parse(date_for_this_shift)}  // converted to Date object for easier searching
        }
 
        filteredSignups = filteredSignups.filter(su => (searchFromDateObj <= su.shift_date && su.shift_date <= searchToDateObj))  // add an extra check for date
        
        const hours_column = filteredSignups.map(su => su.hours)

        let totalHours = 0
        let totalMinutes = 0
        let totalSeconds = 0
        for (let i = 0; i < hours_column.length; i++) {
            let volunteered_time = hours_column[i]
            if (volunteered_time) {
                const [hours, minutes, seconds] = volunteered_time.split(":")
                if (hours >= 0) {  // filter out things with negative time
                    totalHours += parseInt(hours, 10)
                    totalMinutes += parseInt(minutes, 10)
                    totalSeconds += parseInt(seconds, 10)
                }
            }
        }
        totalMinutes += Math.floor(totalSeconds/60)
        totalSeconds %= 60
        totalHours += Math.floor(totalMinutes/60)
        totalMinutes %= 60

        setDisplayVolunteerTime(`Total time: ${totalHours} hours, ${totalMinutes} minutes, ${totalSeconds} seconds`)
    }

    return (
        <div className="default-bg-img">
            <div className="flex justify-center backdrop-blur-xl rounded-xl text-white p-7 border border-[#00539b]">
                <div className="flex flex-col px-6">
                    <h2 className="flex justify-center pb-4 text-lg">Hours Reports</h2>
                    <label htmlFor="firstName">First Name</label>
                    <input className="text-black mb-2 rounded-md p-1.5 m-0.5 tracking-wide" type="text" id="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                    <label htmlFor="lastName">Last Name</label>
                    <input className="text-black mb-2 rounded-md p-1.5 m-0.5 tracking-wide" type="text" id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                    <label htmlFor="searchFrom">Start Date (YYYY-MM-DD)</label>
                    <input className="text-black mb-2 rounded-md p-1.5 m-0.5 tracking-wide" type="text" id="searchFrom" placeholder="2020-01-01" value={searchFrom} onChange={(e)=>setSearchFrom(e.target.value)} />
                    <label htmlFor="searchTo">End Date (YYYY-MM-DD)</label>
                    <input className="text-black mb-2 rounded-md p-1.5 m-0.5 tracking-wide" type="text" id="searchTo" placeholder="2050-01-01"value={searchTo} onChange={(e)=>setSearchTo(e.target.value)} />
                    <button className="mt-4 py-2 px-4 border border-[#00539b] text-white] rounded-md" onClick={handleFetchUserReports}>GET STATS</button>
                    <p className="m-4">{displayVolunteerTime}</p>
                </div>
            </div>
        </div>

    )
}
"use client";

import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react'

export default function Home() {

  const [fetchError, setFetchError] = useState("")
  const [people, setPeople] = useState(null)

  useEffect(() => {
    const fetchPeople = async() => {
      try {
        await supabase
        .from("profiles")
        .select()
        .then((profile, err) => {
          if (profile) {
            console.log(profile)
          } else {
            console.log("error in profiles")
          }
        })
        .then((user) => {
          setPeople(user)
        })
        .then(console.log("this is profiles"))

        await supabase
          .from("signups")
          .select()
          .then((signups, err) => {
            if (signups) {
              console.log(signups)
            } else {
              console.log("error in signups")
            }
          })
          .then(console.log("this is signups"))

          await supabase
          .from("shifts")
          .select()
          .then((shifts, err) => {
            if (shifts) {
              console.log(shifts)
            } else {
              console.log("error in shifts")
            }
          })
          .then(console.log("this is shifts"))
      } catch (err) {
        console.log("caught error")
      }

    }

    fetchPeople()
  })

  if (people) {
    console.log(people)
  }

  return (
    <div>
      <h1>Hello World</h1>
      {/* <p>{people && people[0].first_name}</p> */}
    </div>
  )
}

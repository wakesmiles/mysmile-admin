"use client";

import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react'

export default function Home() {

  const [fetchError, setFetchError] = useState("")
  const [people, setPeople] = useState(null)

  useEffect(() => {
    const fetchPeople = async() => {
      const { data, error } = await supabase
        .from("profiles")
        .select()

        if (error) {
          setFetchError('Could not fetch people')
          setPeople(null)
          console.log(error)
        }

        if (data) {
          setPeople(data)
          setFetchError(null)
        }
    }

    fetchPeople()
  })

  console.log(people)

  return (
    <h1>Hello World</h1>
  )
}

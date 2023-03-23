'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../supabaseClient"

const Login = () => {

    const emailRef = useRef("")
    const passwordRef = useRef("")
    const router = useRouter()

    const login = async (e) => {
        let success = false

        await supabase.auth
            .signInWithPassword({
                email: 'banbim@banbim.com',
                password: 'banbim'
            })
            .then(({data, error}) => {
                if (error) {
                    alert(error.message)
                } else if (data) {
                    success = true
                }
            })
            if (success) router.push("/home")
    }

    return(
        <>
            <button onClick={(e) => login(e)}>Login</button>
        </>
    )
}

export default Login
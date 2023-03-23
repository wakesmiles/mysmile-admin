'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../supabaseClient"

const Login = () => {

    const emailRef = useRef("")
    const passwordRef = useRef("")
    const router = useRouter()

    const login = async (e) => {
        e.preventDefault()
        let success = false

        await supabase.auth
            .signInWithPassword({
                email: emailRef.current.value,
                password: passwordRef.current.value,
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
        <div>
            <form method="POST" onSubmit={(e) => login(e)}>
                <div>
                    <label>Email</label>
                    <input ref={emailRef} name="email" type="email" autoComplete="email" required></input>
                    <label>Password</label>
                    <input ref={passwordRef} name="password" type="password" autoComplete="password" required></input>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login
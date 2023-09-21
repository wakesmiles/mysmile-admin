import "../../styles/defaultpage.css"
import { useState } from "react"
import { supabase } from "../../supabaseClient"

export function FetchUser() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    supabase.auth.getUser().then(async (data, err) => {
      if (!data.data.user) {
        setLoading(false)
        return data.data.user
      }
      const id = data.data.user.id
      await supabase.from('admins')
      .select()
      .eq("id", id)
      .then((admin, err) => {
        if (admin) {
          setUser(admin);
          setLoading(false)
        }
      })
    })
    return [user, loading];
}

export default function UnAuthorizedPage() {
    return (
        <div>
            <font color="red">THIS IS UNAUTHORIZED</font>
        </div>
    )
}
import Link from "next/link"
import Head from "next/head"

import "../../styles/reroute.css"

const Reroute = () => {
    return (
        <div>
            <Head>
                <title>MySmile</title>
            </Head>
            <div className="reroute-container">  {/* for some reason, calling this "container" calls the "container" class in login.css */}
                
                <div className="reroute-messagebox">
                    <p>Login was not authenticated.</p>
                    <p>Please contact the Wake Smiles Management if there has been an error.</p>
                    <div className="reroute-goback">
                        <Link href="/" style={{ textDecoration: 'none' }}>Return</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reroute
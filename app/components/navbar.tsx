import {ReactNode} from 'react'
import "../../styles/navbar.css"
import { useRouter } from 'next/navigation'
import { Url } from 'next/dist/shared/lib/router/router'

interface NavProps{
  setContent: Function
  logout: Function
}

interface ButtonProps{
  children: ReactNode
  onClick: React.MouseEventHandler
}

function NavButton({ children, onClick }: ButtonProps): JSX.Element {
  return (
    <div className="nav-bar hover-underline-animation hover:cursor-pointer text-white text-center py-2 px-4 rounded-md"
    onClick={onClick}>
      {children}
    </div>
  )
}



function Navbar({ logout }: NavProps): JSX.Element {
  const router = useRouter()
  const navigate = async(path: string) => {
    router.push(path)
  }
  return (
    <nav className="w-50 mr-50 flex justify-between items-center px-2 py-2 z-999">
      <div> 
        <ul className="flex p-2 text-lg">
          <li>
            <NavButton onClick={() => navigate("/home/")}>Home</NavButton>
          </li>
          <li>
            <NavButton onClick={() => navigate('/stats/')}>Stats</NavButton>
          </li>
          <li>
            <NavButton onClick={() => navigate("/profiles/")}>Profiles</NavButton>
          </li>       
          <li>
            <NavButton onClick={() => navigate("/signups/")}>Signups</NavButton>
          </li>
          <li>
            <NavButton onClick={() => navigate("/shifts/")}>Shifts</NavButton>
          </li>
        </ul>
      </div>
      <div onClick={() => logout()} className="flex justify-center items-center px-8 py-2 hover:cursor-pointer hover:bg-red-600 text-white text-center text-lg rounded-md mx-1">Logout</div>
    </nav>
  )
}


export default Navbar
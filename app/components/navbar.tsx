import {ReactNode} from 'react'

interface NavProps{
  setContent: Function;
  logout: Function;
}

interface ButtonProps{
  children: ReactNode; 
  onClick: React.MouseEventHandler;
}

function NavButton({ children, onClick }: ButtonProps): JSX.Element {
  return (
    <div className="hover:cursor-pointer text-white text-center py-2 px-4 rounded-md"
    onClick={onClick}>
      {children}
    </div>
  );
}

function Navbar({ setContent, logout }: NavProps): JSX.Element {
  return (
    <nav className="bg-blue-800 h-screen w-[200px] mr-50">
      <ul>
        <li>
          <NavButton onClick={() => setContent("Profiles")}>Profiles</NavButton>
        </li>       
        <li>
          <NavButton onClick={() => setContent("Signups")}>Signups</NavButton>
        </li>
        <li>
          <NavButton onClick={() => setContent("Shifts")}>Shifts</NavButton>
        </li>
        <li>
          <NavButton onClick={() => setContent("None")}>Hide Tables</NavButton>
        </li>
        <li className="hover:cursor-pointer bg-red-500 hover:bg-red-600 text-white text-center font-bold py-2 px-4 rounded-md mx-1" 
        onClick = {() => logout()}>
          Logout
        </li>
      </ul>
    </nav>
  );
}


export default Navbar;
import {ReactNode} from 'react'

interface NavProps{
  content:Function;
}

interface ButtonProps{
  //tableName: String;
  children: ReactNode; 
  onClick: React.MouseEventHandler;
}

function NavButton(props: ButtonProps) {
  return (
    <div className="hover:cursor-pointer"
      onClick={props.onClick}>
      {props.children}
    </div>
  );
}

function Navbar({ content }: NavProps): JSX.Element {
  return (
    <nav>
      <ul>
        <li>
          <NavButton onClick={() => content("Profiles")}>Profiles</NavButton>
        </li>       
         <li>
          <NavButton onClick={() => content("Signups")}>Signups</NavButton>
        </li>
        <li>
          <NavButton onClick={() => content("Shifts")}>Shifts</NavButton>
        </li>
        <li>
          <NavButton onClick={() => content("None")}>Hide Tables</NavButton>
        </li>
      </ul>
    </nav>
  );
}


export default Navbar;
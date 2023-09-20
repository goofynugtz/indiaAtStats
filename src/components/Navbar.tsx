import { Icons } from "./icon"
import useDarkMode from 'use-dark-mode';

const Navbar = () => {
  const darkMode = useDarkMode(false);

  return (
    <div className="navbar">
      <div><Icons.home/></div>
      <div><SunMoon {...{darkMode}} /></div>
    </div>
  )
}

const SunMoon = ({darkMode}:any) => {
  return (
    <div className="SunMoon" onClick={darkMode.toggle}>
      <div>{darkMode.value ? <Icons.sun color={'#ffc107'} /> : <Icons.moon />}</div>
    </div>
  );
};

export default Navbar
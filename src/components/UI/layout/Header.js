import classes from './Header.module.css';
import { Link } from 'react-router-dom';
import logo from '../../UI/layout/Recordo-Logo.png';

const Header = () => {
  return (
    <div className={classes.header}>
      <Link to='/' className={classes.logo}>
        <img src={logo} alt='Logo' />
      </Link>
    </div>
  );
};

export default Header;

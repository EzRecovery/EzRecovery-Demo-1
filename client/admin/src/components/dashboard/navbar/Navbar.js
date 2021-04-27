import "./Navbar.css";
import avatar from "../../../assets/avatar.svg"; //../../assets/avatar.svg

const Navbar = ({ sidebarOpen, openSidebar }) => {
  return (
    <nav className="navbar">
      <div className="nav_icon" onClick={() => openSidebar()}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>
      <div className="navbar__left">

        <a href="/admin" className="active_link">
          Welcome, Admin
        </a>
      </div>
      <div className="navbar__right">

        <a href="/avatar">
          <img width="30" src={avatar} alt="avatar" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

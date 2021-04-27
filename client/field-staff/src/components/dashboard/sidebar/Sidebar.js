import "./Sidebar.css";
import logo from "../../../assets/logo.png";
import { useState } from 'react'
import { Link } from "react-router-dom";


const Sidebar = ({ sidebarOpen, closeSidebar }) => {

  // const changeSubState = () => {
  //   if (sub) {
  //     setSub(false)
  //   }
  //   else {
  //     setSub(true)
  //   }
  // }

  const [subMenu, setSubMenu] = useState(false)

  return (
    <div className={sidebarOpen ? "sidebar_responsive" : ""} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <img src={logo} alt="logo" />
          <h1>EzRecovery</h1>
        </div>
        <i
          onClick={() => closeSidebar()}
          className="fa fa-times"
          id="sidebarIcon"
          aria-hidden="true"
        ></i>
      </div>

      <div className="sidebar__menu">
        <div className="sidebar__link active_menu_link">
          <i className="fa fa-home"></i>
          <Link to='/app/dashboard'>Dashboard</Link>
        </div>
        <h2>Field-Staff</h2>
        <div className="sidebar__link">
          <i className="fa fa-user-secret" aria-hidden="true"></i>
          <Link to="/app/myallocation">My Allocations</Link>
        </div>
        <div className="sidebar__link">
          <i className="fa fa-handshake-o"></i>
          <Link onClick={() => setSubMenu(!subMenu)}>Leaves</Link>
          <br /><br />
          {subMenu &&
            <div className="sidebar__link">
              <i className="fa fa-question"></i>
              <Link to="/app/leaves/add">Add</Link><br /><br />
              <i className="fa fa-sign-out"></i>
              <Link to="/app/leaves/revoke">Revoke</Link>
            </div>
          }
        </div>
        <div className="sidebar__link">
          <i className="fa fa-wrench"></i>
          <Link to="/app/location">Location Preference</Link>
        </div>
        <div className="sidebar__link">
          <i className="fa fa-archive"></i>
          <Link to="/app/report">Reports</Link>
        </div>
        {/* <div className="sidebar__link">
          <i className="fa fa-handshake-o"></i>
          <Link to="/app/monitor">Monitor Field-Staff</Link>
        </div>
        <div className="sidebar__link">
          <i className="fa fa-handshake-o"></i>
          <Link to="/app/reports" onClick={() => changeSubState()}>Reports</Link>
          <br /><br />
          {sub &&
            <div className="sidebar__link">
              <i className="fa fa-question"></i>
              <Link to="/app/reports/daily">Daily</Link><br /><br />
              <i className="fa fa-sign-out"></i>
              <Link to="/app/reports/daily">Monthly</Link>
            </div>
          }
        </div>
        <div className="sidebar__link">
          <i className="fa fa-money"></i>
          <Link to="/app/export">Export</Link><br /><br />
        </div> */}
        <div className="sidebar__logout">
          <i className="fa fa-power-off"></i>
          <button className="logoutbutton" onClick={() => { localStorage.clear(); window.location.reload(false); }} >logout</button>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;

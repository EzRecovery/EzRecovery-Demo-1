import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Navbar and Sidebar
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

//pages

// import ExportPage from "../export/exportPage"; //../pages/export/exportPage
// import ImportPage from "../import/ImportPage";
//import AddLeave from "../pages/leaves/addLeave";
//import DailyMain from "../Reports/Daily/main";
// import DashboardPage from "../pages/DashboardPage";
// import ImportPage from "../pages/ImportPage";
import MyAllocation from "../MyAllocation/MyAllocation";
import Ticket from "../Ticket/Ticket"
import Leaves from "../leaves/addLeave"


const Dashboard = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false);
    const openSidebar = () => {
        setsidebarOpen(true);
    };
    const closeSidebar = () => {
        setsidebarOpen(false);
    };
    return (
        <Router>
            <div className="container">
                <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
                <Switch>
                    {/* <Route exact path='/app/dashboard' component={DashboardPage} /> */}
                    <Route exact path='/app/myallocation' component={MyAllocation} />
                    <Route exact path='/app/ticket' component={Ticket} />
                    <Route exact path='/app/leaves/add' component={Leaves} />
                    {/* <Route exact path='/app/manage' component={AddLeave} /> */}
                </Switch>
                <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
            </div>
        </Router>
    );
};

export default Dashboard;

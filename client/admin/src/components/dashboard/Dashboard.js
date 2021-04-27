import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Navbar and Sidebar
import Navbar from "../dashboard/navbar/Navbar";
import Sidebar from "../dashboard/sidebar/Sidebar";

//pages
//import DashboardPage from "../pages/DashboardPage";
import ExportPage from "../pages/export/exportPage";
import ImportPage from "../pages/import/ImportPage";
import AddLeave from "../pages/leaves/addLeave";
import DailyMain from "../pages/Reports/Daily/main";
import Allocation from "../pages/Allocation/Allocation";
import View_records from "../pages/view_records/View_records";
import Manage from "../pages/Manage";

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
                    <Route exact path='/app/import' component={ImportPage} />
                    <Route exact path='/app/export' component={ExportPage} />
                    <Route exact path='/app/reports/daily' component={DailyMain} />
                    <Route exact path='/app/manage' component={Manage} />
                    <Route exact path='/app/view' component={View_records} />
                    <Route exact path='/app/allocation' component={Allocation} />
                </Switch>
                <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
            </div>
        </Router>
    );
};

export default Dashboard;

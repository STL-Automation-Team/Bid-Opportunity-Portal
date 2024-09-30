import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Uploader from "./components/Uploader";
import UserManagement from './components/UserManagement';
import AdminSettings from "./pages/AdminSettings";
import AddAsset from "./pages/Assets/AddAsset";
import AssetList from "./pages/Assets/AssetList";
import EditAsset from "./pages/Assets/EditAsset";
import ReadAsset from "./pages/Assets/ReadAsset";
import AddLicense from "./pages/Licenses/AddLicense";
import EditLicense from "./pages/Licenses/EditLicense";
import LicensesList from "./pages/Licenses/LicensesList";
import ReadLicense from "./pages/Licenses/ReadLicense";
import Home from './pages/MainDashboard/Home';
import AddOperation from "./pages/Operations/AddOperation";
import EditOperation from "./pages/Operations/EditOperation";
import AddOpportunities from './pages/Opportunities/AddOpportunities';
import CreateOpportunity from './pages/Opportunities/CreateOpportunity';
import OpportunitiesPage from './pages/Opportunities/OpportunitiesList';
import OpportunityDetails from './pages/Opportunities/OpportunityDetails';
import UpdateOpportunity from "./pages/Opportunities/UpdateOpportunity";
import CustomFields from "./pages/Settings/Customfields/CustomFields";
import CustomFieldsList from "./pages/Settings/Customfields/CustomFieldsList";
import AssetModel from "./pages/Settings/Model/AssetModel";
import ModelList from "./pages/Settings/Model/ModelList";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";
import ReadUser from "./pages/Users/ReadUser";

import "./styles/basic.css";
import { BasicTable } from "./table/BasicTable";
// import ReadOperation from './pages/Operations/ReadOperation'
import { AccessDeniedProvider } from './components/AccessDeniedProvider';
function App1({onLogout}) {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // if (!isAuthenticated) {
  //   return <LoginPage onLogin={setIsAuthenticated} />;
  // }

  return (
    
    <div className="app">
      <Router>
      <AccessDeniedProvider onLogout={onLogout}>

        <Sidebar />
        <div className="page-container">
        <Navbar onLogout={onLogout}/>
          <Routes>
            <Route exact path="/" element={<OpportunitiesPage />} />
            <Route exact path="/analytics" element={<Home />} />
            <Route exact path="/addopportunity" element={<CreateOpportunity />} />
            <Route exact path="/addopportunity1" element={<AddOpportunities />} />
            <Route exact path="/updateOpportunity/:id" element={<UpdateOpportunity />} />
            <Route exact path="/opportunity/:id" element={<OpportunityDetails />} />
            <Route exact path="/licenseslist" element={<LicensesList />} />
            <Route exact path="/addlicense" element={<AddLicense />} />
            <Route exact path="/editlicense/:Id" element={<EditLicense />} />
            <Route exact path="/readlicense/:id" element={<ReadLicense />} />
            <Route exact path="/testtable" element={<BasicTable />} />
            <Route exact path="/assetslist" element={<AssetList />} />
            <Route exact path="/editasset/:Id" element={<EditAsset />} />
            <Route exact path="/addasset" element={<AddAsset />} />
            <Route exact path="/assetmodel" element={<AssetModel />} />
            <Route exact path="/modellist" element={<ModelList />} />
            <Route exact path="/uploader" element={<Uploader />} />
            <Route exact path="/customfields" element={<CustomFields />} />
            <Route
              exact
              path="/customfieldslist"
              element={<CustomFieldsList />}
            />
            <Route exact path="/readasset/:id" element={<ReadAsset />} />
            <Route exact path="/userslist" element={<UserManagement />} />
            <Route exact path="/adduser" element={<AddUser />} />
            <Route exact path="/edituser/:id" element={<EditUser />} />
            <Route exact path="/readuser/:id" element={<ReadUser />} />
            <Route exact path="/operationslist" element={<OpportunitiesPage />} />
            <Route exact path="/addoperation" element={<AddOperation />} />
            <Route
              exact
              path="/editoperation/:Id"
              element={<EditOperation />}
            />
            {/* <Route exact path="/readoperation" element={<ReadOperation/>} /> */}

            <Route exact path="/adminsettings" element={<AdminSettings />} />
          </Routes>
        </div>

        </AccessDeniedProvider>

      </Router>
    </div>
  );
}

export default App1;

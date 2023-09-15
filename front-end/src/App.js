import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HrLogin from './components/HrLogin';
import EmployeeLogin from './components/EmployeeLogin';
import HrDashboard from './components/HrDashBoard/HrDashboard';
import EmpDashboard from './components/EmpDashBoard/EmpDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/hrlogin" element={<HrLogin/>} />
        <Route path="/employeelogin" element={<EmployeeLogin/>} />
        <Route path="/hr/dashboard" element={<HrDashboard/>} />
        <Route path="/emp/dashboard" element={<EmpDashboard/>} />
        

        


      </Routes>
    </Router>
  );
};

export default App;

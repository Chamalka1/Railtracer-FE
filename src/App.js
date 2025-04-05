import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Authentication/Login/Login';
import WarehouseDashboard from './pages/WarehouseDashboard/WarehouseDashboard';
import  Whparcelsort from './pages/Whparcelsort/Whparcelsort';
import ReportGeneration from './pages/ReportsGeneration/ReportsGeneration';
import ReportsGeneration from './pages/ReportsGeneration/ReportsGeneration';



function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/WarehouseDashboard' element={<WarehouseDashboard/>} />
    <Route path='/Whparcelsort' element={<Whparcelsort/>} />
    <Route path='/ReportsGeneration' element={<ReportsGeneration/>} />
    
    
    

    </Routes>
    
   </BrowserRouter>  
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Authentication/Login/Login';
import { LogiAdmin } from './pages/LogiAdmin/LogiAdmin';
import {Details} from './pages/Details/Details';
import {LogiDashboard} from './pages/LogiDashboard/LogiDashboard';
import DamageUpdate from './pages/DamageUpdate/DamageUpdate';





function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/LogiAdmin' element={<LogiAdmin/>} />
    <Route path='/Details' element={<Details/>} />
    <Route path='/LogiDashboard' element={<LogiDashboard/>} />
    <Route path='/DamageUpdate' element={<DamageUpdate/>} />
    </Routes>
    
   </BrowserRouter>  
    </div>
  );
}

export default App;

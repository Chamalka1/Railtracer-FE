import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Authentication/Login/Login';
import { LogiAdmin } from './pages/LogiAdmin/LogiAdmin';





function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/LogiAdmin' element={<LogiAdmin/>} />
    </Routes>
    
   </BrowserRouter>  
    </div>
  );
}

export default App;

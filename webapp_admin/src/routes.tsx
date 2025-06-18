import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Home from "./pages/dashboard/Home";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home" element={<Home/>}>
                </Route> </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import DashboardHome from "./pages/dashboard/DashboardHome";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home" element={<DashboardHome/>}>
                </Route> </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

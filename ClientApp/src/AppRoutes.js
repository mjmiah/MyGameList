import HomePage from './components/HomePage'; // HomePage
import ProfilePage from './components/ProfilePage'; // User Profile page
import LoginPage from './components/LoginPage'; // Login page
import RegisterPage from './components/RegisterPage'; // Registration page
import SearchPage from './components/SearchPage'; // Search page for searching games

const AppRoutes = [
    {
        path: "/",
        element: <HomePage /> // HomePage displayed at the root route
    },
    {
        path: "/profile",
        element: <ProfilePage /> // ProfilePage displayed at /profile
    },
    {
        path: "/login",
        element: <LoginPage /> // LoginPage displayed at /login
    },
    {
        path: "/register",
        element: <RegisterPage /> // RegisterPage displayed at /register
    },
    {
        path: "/search",
        element: <SearchPage /> // SearchPage displayed at /search
    }
];

export default AppRoutes;
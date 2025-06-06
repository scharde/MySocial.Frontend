import { jsx as _jsx } from "react/jsx-runtime";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PrivateRoute from "@/components/PrivateRoute";
import Unauthorized from "@/components/Unauthorized";
import SocialFeed from "@/Module/Feed/SocialFeed";
import Layout from "@/Module/Layout";
import SignUp from "@/components/sign-in/SignUp";
function App() {
    const router = createBrowserRouter([
        {
            path: "/unauthorized",
            Component: Unauthorized,
        },
        {
            path: "/sign-in",
            Component: SignIn,
        },
        {
            path: "/sign-up",
            Component: SignUp,
        },
        {
            path: "/home",
            element: (_jsx(PrivateRoute, { children: _jsx(Layout, { children: _jsx(SocialFeed, {}) }) })),
        },
        {
            path: "/",
            element: (_jsx(PrivateRoute, { children: _jsx(Layout, { children: _jsx(SocialFeed, {}) }) })),
        },
    ]);
    return (_jsx(Provider, { store: store, children: _jsx(RouterProvider, { router: router }) }));
}
export default App;

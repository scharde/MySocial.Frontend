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
import AuthCallback from "@/components/AuthCallback";

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
      path: "/auth-callback",
      Component: AuthCallback,
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Layout>
            <SocialFeed />
          </Layout>
        </PrivateRoute>
      ),
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

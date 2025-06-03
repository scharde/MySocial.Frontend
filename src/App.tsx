import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PrivateRoute from "@/components/PrivateRoute";
import Unauthorized from "@/components/Unauthorized";
import Home from "@/Module/Dashboard/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/unauthorized",
      Component: Unauthorized,
    },
    {
      path: "/login",
      Component: SignIn,
    },
    {
      path: "/home",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Home />
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

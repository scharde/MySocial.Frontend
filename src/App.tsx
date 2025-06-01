import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/SingIn.tsx";

function App() {
  var handleLoginWithGoogle = () => {
    window.location.href =
      "https://localhost:7040/api/Auth/google-login?returnUrl=http://localhost:5174/logged-in";
  };

  const router = createBrowserRouter([
    {
      path: "/logged-in",
      element: <div>Hello World</div>,
    },
    {
      path: "/sign-in",
      element: (
        <button onClick={handleLoginWithGoogle}>Sign in with Google </button>
      ),
    },
    {
      path: "/login",
      element: <SignIn />,
    },
    {
      path: "/",
      element: <>Home</>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

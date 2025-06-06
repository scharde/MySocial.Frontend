import { Backdrop, CircularProgress, styled } from "@mui/material";
import { type JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { checkAuthActionAsync } from "@/redux/userSlice";
import { UserLoggedInType } from "@/model/User";

interface IPrivateRoute {
  children: JSX.Element;
  roles?: string[];
}

const PrivateRoute = ({ children }: IPrivateRoute) => {
  const dispatch = useAppDispatch();
  const { userLoggedInStatus } = useAppSelector(
    (state: RootState) => state.userState,
  );
  const [loading, setLoading] = useState(
    userLoggedInStatus === UserLoggedInType.None,
  );

  useEffect(() => {
    if (userLoggedInStatus !== UserLoggedInType.None) return;

    async function checkAuth() {
      try {
        await dispatch(checkAuthActionAsync());
      } finally {
        setLoading(false);
      }
    }

    checkAuth().then((r) => {});
  }, [dispatch, userLoggedInStatus]);

  if (loading) {
    return <LoadingLoader />;
  }

  if (userLoggedInStatus === UserLoggedInType.Yes) {
    return children;
  } else if (userLoggedInStatus === UserLoggedInType.No) {
    return <Navigate to="/sign-in" />;
  }

  return <LoadingLoader />;
};

const BootstrapBackdrop = styled(Backdrop)({
  backgroundColor: "transparent",
});

const LoadingLoader = () => {
  return (
    <BootstrapBackdrop
      open={true}
      style={{ color: "var(--primary-color)", zIndex: 9999 }}
    >
      <CircularProgress color="inherit" />
    </BootstrapBackdrop>
  );
};

export default PrivateRoute;

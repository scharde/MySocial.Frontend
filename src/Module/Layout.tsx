"use client";

import React, { ReactNode, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Logout, Settings, Person } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { getUserActionAsync, logoutActionAsync } from "@/redux/userSlice";
import { LoadingStatus } from "@/model/User";
import { LoadingLoader } from "@/components/PrivateRoute";
import AppTheme from "@/components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import ColorModeSelect from "@/components/shared-theme/ColorModeSelect";

export default function Layout(props: {
  disableCustomTheme?: boolean;
  children: ReactNode;
}) {
  const router = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, userLoadingStatus } = useAppSelector(
    (store: RootState) => store.userState,
  );

  useEffect(() => {
    if (userLoadingStatus != LoadingStatus.Loading && !user) {
      dispatch(getUserActionAsync());
    }
  }, []);

  useEffect(() => {
    if (userLoadingStatus == LoadingStatus.Loaded && !user) {
      router("/sign-in");
    }
  }, [user, userLoadingStatus, router]);

  const handleLogout = async () => {
    dispatch(logoutActionAsync());
    dispatch({ type: "RESET" });
    router("/sign-in");
  };

  if (userLoadingStatus == LoadingStatus.Loading) {
    return <LoadingLoader />;
  }

  if (!user) {
    return null;
  }

  const name = `${user.firstName.toLocaleUpperCase()} ${user.lastName.toLocaleUpperCase()}`;
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box>
        {/* Navigation Bar */}
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sky Social
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2">Welcome, {name}</Typography>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <Avatar src={user.avatar} alt={name}>
                  {name.charAt(0)}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)} disabled>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)} disabled>
                <Settings sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>

            <ColorModeSelect />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ pt: 3 }}>{props.children}</Box>
      </Box>
    </AppTheme>
  );
}

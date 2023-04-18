"use client";

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  Drawer,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import { useCallback } from "react";
import React, { useState } from "react";

const tabs = ["Profiles", "Signups", "Shifts", "Stats"] as const;
type Content = typeof tabs[number];
interface NavProps {
  // TODO: strongly type content in /home/page
  setContent: (content: Content) => void;
  logout: () => void;
}

function Navbar({ setContent, logout }: NavProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [userProfileOpen, setUserProfileOpen] = useState<boolean>(false);

  const handleOpenUserProfile = (event: React.MouseEvent<HTMLElement>) => {
    setUserProfileOpen(true);
  };

  const handleCloseUserProfile = () => {
    setUserProfileOpen(false);
  };

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerOpen(open);
    },
    []
  );

  return (
    <AppBar position="static">
      {/* 
        Note: tailwind styling clashes with MUI default component styling, should give 
        preference to MUI styling and adjusting defaults, otherwise there will be inconsistencies.
      */}
      <Container maxWidth="xl" className="bg-purple-800">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 10,
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
            }}
          >
            MySmile
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <NavBarList
                onClose={toggleDrawer(false)}
                setContent={setContent}
              />
            </Drawer>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            MySmile
          </Typography>
          {/* TO-DO: create seperate component for redundancy*/}
          {/* logout popout on the profile button click */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleOpenUserProfile}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={null}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(userProfileOpen)}
            onClose={handleCloseUserProfile}
          >
            <MenuItem onClick={logout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
          <Box
            justifyContent="flex-end"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            {tabs.map((content) => (
              <Button
                key={content}
                onClick={() => setContent(content)}
                sx={{ my: 2, mx: 1, color: "white", display: "block" }}
              >
                {content}
              </Button>
            ))}

            {/* logout popout on the profile button click */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={handleOpenUserProfile}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={null}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(userProfileOpen)}
              onClose={handleCloseUserProfile}
            >
              <MenuItem onClick={logout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
interface NavBarListProps {
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  setContent: (content: Content) => void;
}

function NavBarList({ onClose, setContent }: NavBarListProps) {
  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {tabs.map((content) => (
          <ListItem
            key={content}
            disablePadding
            onClick={() => setContent(content)}
          >
            <ListItemButton>
              <ListItemText primary={content} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Navbar;

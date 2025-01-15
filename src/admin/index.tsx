import React, { ReactNode, useState } from "react";
import AddDestination from './screens/addDestination';
import DestinationList from './screens/destination';
import DestinationProfileManager from './screens/permission';
import DashboardScreen from "./screens/dashboard";
import '@fontsource/inter';

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Box,
  Divider,
  Input
} from "@mui/material";
import { Home, Dashboard, AddLocation, Category, Lock } from "@mui/icons-material";
import { Sheet, Typography as JoyTypography } from "@mui/joy";
import Categories from "./screens/categories";

import './assets/style/css/customer.css';

// Largeur de la barre latérale
const drawerWidth = 240;

// Typage pour les sections
type Section = "permission" | "dashboard" | "settings" | "logout" | "destination" | "categories" | "list_destination";

// Items du menu
const menuItems: { label: string; icon: React.ReactNode; section: Section }[] = [
  { label: "Dashboard", icon: <Home />, section: "dashboard" },
  { label: "All destinations", icon: <Dashboard />, section: "list_destination" },
  { label: "Add destinations", icon: <AddLocation />, section: "destination" },
  { label: "Categories", icon: <Category />, section: "categories" },
  { label: "Permission", icon: <Lock />, section: "permission" },
];

// Composant de template du back-office
type BackOfficeTemplateProps = {
  children?: ReactNode;
};

const BackOfficeTemplate: React.FC<BackOfficeTemplateProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<Section>("dashboard");

  return (
    <Box sx={{ display: "flex" }}>
      {/* Barre d'application (AppBar de Material UI) */}

      {/* Barre latérale */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: '#0b0d0e',
            // Espace pour le logo et la barre de recherche
          },
        }}
      >
        {/* Logo de l'entreprise */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'10px', marginBottom:'30px'}}>
          <img
            src="https://img.freepik.com/psd-gratuit/gradient-par-rapport-au-modele-logo_23-2151514112.jpg?t=st=1736907569~exp=1736911169~hmac=3459622e06957d7b7aedf39e231bce5eeec9e0fba06a65e780e28739fe522b50&w=826" // Remplacez par l'URL de votre logo
            alt="Logo de l'entreprise"
            style={{ width: '80px', height: '80px', borderRadius:'10px' }}
          />
        </Box>

        {/* Barre de recherche */}
        {/* Liste des éléments du menu */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => setSelectedSection(item.section)}
                sx={{
                  cursor: "pointer",
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: 'background.level2',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <JoyTypography >
                  {item.label}
                </JoyTypography>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Décale le contenu pour laisser de l'espace sous l'AppBar
        }}
      >
        {children}
        <Box>
          {selectedSection === "dashboard" && <DashboardScreen />}
          {selectedSection === "list_destination" && <DestinationList />}
          {selectedSection === "categories" && <Categories />}
          {selectedSection === "destination" && (<AddDestination />)}
          {selectedSection === "permission" && (<DestinationProfileManager />)}
        </Box>
      </Box>
    </Box>
  );
};

// Composant principal
const IndexAdmin: React.FC = () => {
  return (
    <BackOfficeTemplate>
    </BackOfficeTemplate>
  );
};

export default IndexAdmin;

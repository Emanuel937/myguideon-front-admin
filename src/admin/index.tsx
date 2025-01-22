import React, { ReactNode, useState } from "react";
import AddDestination from './screens/addDestination';
import DestinationList from './screens/destination';
import DestinationProfileManager from './screens/permission';
import DashboardScreen from "./screens/dashboard";
import AddTingstoDo from './screens/addThingstoDo';
import CountrySearch from './screens/test';

import '@fontsource/inter';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Box,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  TravelExplore as TravelExploreIcon,
  AddLocationAlt as AddLocationAltIcon,
  Assignment as AssignmentIcon,
  AddTask as AddTaskIcon,
  Category as CategoryIcon,
  Lock as LockIcon
} from "@mui/icons-material";


import { Typography as JoyTypography } from "@mui/joy";
import Categories from "./screens/categories";

import './assets/style/css/customer.css';
import ThingstoDo from './screens/thingstoDo';

const drawerWidth = 240;

type Section = "permission" | "dashboard" | "settings" | "logout" | "destination" | "categories" | "list_destination"
  | "things_to_do" | "add_things_to_do" | "test";

const menuItems: { label: string; icon: React.ReactNode; section: Section }[] = [
  { label: "Dashboard", icon: <HomeIcon />, section: "dashboard" },
  { label: "All destinations", icon: <TravelExploreIcon />, section: "list_destination" },
  { label: "Add destinations", icon: <AddLocationAltIcon />, section: "destination" },
  { label: "All things to do", icon: <AssignmentIcon />, section: "things_to_do" },
  { label: "Add things to do", icon: <AddTaskIcon />, section: "add_things_to_do" },
  { label: "Categories", icon: <CategoryIcon />, section: "categories" },
  { label: "Permission", icon: <LockIcon />, section: "permission" },
  { label: "test", icon: <LockIcon />, section: "test" },
];

type BackOfficeTemplateProps = {
  children?: ReactNode;
};

const BackOfficeTemplate: React.FC<BackOfficeTemplateProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<Section>("dashboard");

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: '#0b0d0e',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '30px' }}>
          <img
            src="/assets/img/logo.png"
            alt="Logo de l'entreprise"
            style={{ width: '200px', height:'90px', objectFit:'contain'}}
          />
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => setSelectedSection(item.section)}
                className={selectedSection === item.section ? "active-menu-item" : ""}
                sx={{
                  cursor: "pointer",
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: 'background.level2',
                  },
                }}
              >
                <ListItemIcon style={{ color: '#9fa6ad' }}>
                  {item.icon}
                </ListItemIcon>
                <JoyTypography style={{ color: '#9fa6ad' }}>
                  {item.label}
                </JoyTypography>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#F9F9F9',
          height: '100vh'
        }}
      >
        {children}
        <Box>
          {selectedSection === "dashboard" && <DashboardScreen />}
          {selectedSection === "list_destination" && <DestinationList />}
          {selectedSection === "categories" && <Categories />}
          {selectedSection === "destination" && <AddDestination />}
          {selectedSection === "permission" && <DestinationProfileManager />}
          {selectedSection === "things_to_do" && <ThingstoDo />}
          {selectedSection == 'add_things_to_do' && <AddTingstoDo index={null} />}
          {selectedSection == 'test' &&  <CountrySearch/>}
        </Box>
      </Box>
    </Box>
  );
};

const IndexAdmin: React.FC = () => {
  return (
    <BackOfficeTemplate>
    </BackOfficeTemplate>
  );
};

export default IndexAdmin;

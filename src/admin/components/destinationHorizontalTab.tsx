import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DestinationBasicInfo from './destinationBasicInfo'
import Media from "./destinationGalery";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `horizontal-tab-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

type basicPros = number | null;


export default function HorizontalTabs({ index = null }: { index?: basicPros }){

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box display="flex">
    
      <Box flex={3}>
          
      <Typography
       variant="h2"
       sx={{fontSize:'25px', fontWeight:'bold', marginBottom:'20px'}}
      >
        Add destination & Gallery 
      </Typography>
             
      <Typography
        sx={{marginBottom:'20px'}}
      >
        add destination and its gallery 
      </Typography>
    
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Horizontal tabs example"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#1976d2",
              height: "3px",
            },
          }}
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              color: "#444",
            }
          }}
        >
          <Tab label="Basic Info" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
          <Tab label="Culture" {...a11yProps(2)} />
          <Tab label="Pratique Info" {...a11yProps(2)} />
          <Tab label="Histoire" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Contenu des panneaux */}
      <TabPanel value={value} index={0}>
        <Typography variant="body1">
         <DestinationBasicInfo index={index}/>
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Media index={index}/>
      </TabPanel>
      </Box>
      <Box flex={2}>
      </Box>
    </Box>
  );
}

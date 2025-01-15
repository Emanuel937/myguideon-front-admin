import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DestinationBasicInfo from './destinationBasicInfo'
import Media from "./destinationGalery";
import ActivityForm from "./activityform";

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

export default function HorizontalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%",  borderRadius: "2px"}}>
      {/* Conteneur des onglets */}
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
            },
            "& .Mui-selected": {
              color: "#1976d2",
            },
          }}
        >
          <Tab label="Basic Info" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
          <Tab label="Activity" {...a11yProps(2)} />
          <Tab label="Things To Do" {...a11yProps(3)} />
          <Tab label="Culture" {...a11yProps(4)} />
        </Tabs>
      </Box>

      {/* Contenu des panneaux */}
      <TabPanel value={value} index={0}>
        <Typography variant="body1">
         <DestinationBasicInfo/>
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Media/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ActivityForm/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant="h6" gutterBottom>
          Things To Do
        </Typography>
        <Typography variant="body1">
          Explorez les choses à faire et à découvrir ici.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography variant="h6" gutterBottom>
          Culture
        </Typography>
        <Typography variant="body1">
          Plongez dans la culture de cet endroit.
        </Typography>
      </TabPanel>
    </Box>
  );
}

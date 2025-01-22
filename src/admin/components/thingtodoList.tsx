import React, { useState, useEffect } from "react";
import "@fontsource/inter";
import axios from "axios";
import HorizontalTabs from './destinationHorizontalTab'
import HOSTNAME_WEB from '../constants/hostname'
import AddThingsToDoForm from './addthingstodoform';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material";

const ThingstoDoList: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);

  const [editIndex, setEditIndex] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDestinations = React.useMemo(() => {
    if (!sortConfig) return activities;

    return [...activities].sort((a, b) => {
      const key = sortConfig.key as keyof typeof activities[0];

      if (a[key] < b[key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [activities, sortConfig]);

  const filteredDestinations = sortedDestinations.filter(
    (activities) =>
      (!searchQuery || activities.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedLanguage || activities.language === selectedLanguage) &&
      (!selectedCurrency || activities.currency === selectedCurrency)
  );

  const paginatedDestinations = filteredDestinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleLanguageFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value as string);
  };

  const handleCurrencyFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value as string);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (activities: any) => {
    setEditingDestination(activities); // Set the destination being edited
    setOpenDialog(true);
  };


  const handleDeleteClick = (id: number) => {
    

    setActivities((prev) => prev.filter((dest) => dest.id !== id));

    // delete from database 

    fetch(`${HOSTNAME_WEB}/activities/delete/${id}`,{
      method:'DELETE'
    })
    .then((response)=> {
      if(!response.ok){
        throw new Error('There is an erreur');
      }
      return response.json();
    })
    .catch((error)=>{
        console.log(error);
    });
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${HOSTNAME_WEB}/activities`);
      if(response.status ===  200){
        const data = response.data.map((item:any)=>{
            return {
              id:item.id,
              name:item.name,
              address:item.adress,
              icon:item.icon,
              destination_name:item.destination_name

            }
        });

        setActivities(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des destinations:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return <Box padding={3}>
  {editingDestination && 
   
  
    <div>
         <button className=" btn border font-weight-bold"
         onClick={()=>{
            setEditingDestination(null);
         }}
         >  
          <i className="bi bi-arrow-left"></i>   Back   </button>
        <AddThingsToDoForm index={editIndex}/>
      
    </div>

  }

  {!editingDestination && (
    <>
      <Typography
        variant="h2"
        sx={{ fontSize: "30px", fontWeight: "bold" }}
      >
        All Things to Do
      </Typography>
      <Typography variant="subtitle2" mt={2} mb={2}>
        All things to do are listed here. If you need to link an activity to a destination, please switch to edit mode.
      </Typography>

      <Box
        display="flex"
        gap={3}
        marginBottom={3}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <TextField
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          sx={{
            maxWidth: "400px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#007BFF",
              },
            },
          }}
        />
      </Box>

      <TableContainer
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Destination Name", "Address"].map((key) => (
                <TableCell
                  sx={{ fontWeight: "400" }}
                  key={key}
                  onClick={() => handleSort(key.toLowerCase())}
                >
                  {key.toUpperCase()}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "400" }}>IMAGE</TableCell>
              <TableCell sx={{ fontWeight: "400" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedDestinations.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{activity.destination_name}</TableCell>
                <TableCell>{activity.address}</TableCell>
                <TableCell>
                  <img
                    src={`${HOSTNAME_WEB}/public/uploads/destination/activities/${activity.icon}`}
                    alt={activity.name}
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%", // Correct usage for rounded images
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() =>{

                   handleEditClick(activity)
                   setEditIndex(activity.id);
                   
                  }}
                   >
                    <i className="bi bi-pen"></i>
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteClick(activity.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredDestinations.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  )}
</Box>

};

export default ThingstoDoList;

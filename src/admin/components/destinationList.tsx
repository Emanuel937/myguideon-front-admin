import React, { useState, useEffect } from "react";
import "@fontsource/inter";
import axios from "axios";
import HorizontalTabs from "./destinationHorizontalTab";
import HOSTNAME_WEB from "../constants/hostname";
import truncateText from "../../utils/truncatetext";
import Snackbar from '@mui/material/Snackbar'; 
import Alert from '@mui/material/Alert';

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
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(""); // État pour le filtre de devise
  const [selectedStatus, setSelectedStatus] = useState(""); // État pour le filtre de statut
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [successAlert, setSuccessAlert] = useState(false);

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
    if (!sortConfig) return destinations;

    return [...destinations].sort((a, b) => {
      const key = sortConfig.key as keyof typeof destinations[0];
      if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [destinations, sortConfig]);

  const filteredDestinations = sortedDestinations.filter(
    (destination) =>
      (!searchQuery || destination.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedLanguage || destination.language === selectedLanguage) &&
      (!selectedCurrency || destination.currency === selectedCurrency) && // Filtre par devise
      (!selectedStatus || destination.status === selectedStatus) // Filtre par statut
  );

  const paginatedDestinations = filteredDestinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleLanguageFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value as string);
  };

  const handleCurrencyFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value as string); // Gestion du changement de filtre de devise
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string); // Gestion du changement de filtre par statut
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${HOSTNAME_WEB}/destination`);
      if (response.status === 200) {
        const data = response.data.map((item: any) => {
          const parsedBasicInfo = JSON.parse(item.basic_info);
          return {
            id: item.id,
            name: parsedBasicInfo.destinationName,
            language: parsedBasicInfo.language,
            budget: parsedBasicInfo.budget,
            currency: parsedBasicInfo.currency,
            country: parsedBasicInfo.address || "N/A",
            status: parsedBasicInfo.status || "N/A",
            image: item.imageCover || "https://via.placeholder.com/150",
          };
        });
        setDestinations(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des destinations:", error);
    }
  };

  const handleDeleteDestinationFromDatabase = async (id:number)=>{
    const response = await fetch(`${HOSTNAME_WEB}/destination/delete/${id}`,
      {method:'DELETE'}
    )
    .then((response)=>{
        if(!response.ok){
          throw("there is an error")
        
        }
        return response.json();
    })
    .then((data)=>{
        if(data){
            setSuccessAlert(true);
            fetchDestinations();
        }
    })
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <Box padding={3}>
      {!editingDestination && (
        <div>
          <Typography variant="h2" sx={{ fontSize: "30px", fontWeight: "bold" }}>
            All Destinations
          </Typography>
          <Typography variant="subtitle2" mt={2} mb={2}>
            All destination list, search and edit the destination that you want...
          </Typography>
          <Box display="flex" gap={3} marginBottom={3} flexWrap="wrap" justifyContent="space-between">
            <TextField
              placeholder="Rechercher"
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
            <Box display="flex" gap={3}>
              <Box>
                <label style={{ margin: "10px 15px 0px 0px", fontSize: "14px" }}>Langues:</label>
                <FormControl sx={{ minWidth: 140 }}>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageFilterChange}
                    displayEmpty
                    variant="outlined"
                    sx={{
                      maxWidth: "200px",
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
                  >
                    <MenuItem value="">
                      <em>Toutes</em>
                    </MenuItem>
                    {[...new Set(destinations.map((d) => d.language))].map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <label style={{ margin: "10px 15px 0px 0px", fontSize: "14px" }}>Statut:</label>
                <FormControl sx={{ minWidth: 140 }}>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusFilterChange}
                    displayEmpty
                    variant="outlined"
                    sx={{
                      maxWidth: "200px",
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
                  >
                    <MenuItem value="">
                      <em>Tous</em>
                    </MenuItem>
                    {[...new Set(destinations.map((d) => d.status))].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <label style={{ margin: "10px 15px 0px 0px", fontSize: "14px" }}>Devise:</label>
                <FormControl sx={{ minWidth: 140 }}>
                  <Select
                    value={selectedCurrency}
                    onChange={handleCurrencyFilterChange}
                    displayEmpty
                    variant="outlined"
                    sx={{
                      maxWidth: "200px",
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
                  >
                    <MenuItem value="">
                      <em>Toutes</em>
                    </MenuItem>
                    {[...new Set(destinations.map((d) => d.currency))].map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
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
                <TableCell sx={{ fontWeight: "400", cursor: "pointer" }}>Image</TableCell>
                <TableCell
                  sx={{ fontWeight: "400", cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                >
                  NAME {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                {["country", "language", "budget", "currency", "status"].map((key) => (
                  <TableCell
                    sx={{ fontWeight: "400", cursor: "pointer" }}
                    key={key}
                    onClick={() => handleSort(key)}
                  >
                    {key.toUpperCase()} {sortConfig?.key === key && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "400" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDestinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <img
                      src={`${HOSTNAME_WEB}${destination.image}`}
                      alt={destination.name}
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "100px",
                      }}
                    />
                  </TableCell>
                  <TableCell>{truncateText(destination.name, 30)}</TableCell>
                  <TableCell>{truncateText(destination.country, 30)}</TableCell>
                  <TableCell>{destination.language}</TableCell>
                  <TableCell>
                    {destination.budget} {destination.currency}
                  </TableCell>
                  <TableCell>{destination.currency}</TableCell>
                  <TableCell>{destination.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => setEditingDestination(destination.id)}>
                      <i className="bi bi-pen"></i>
                    </Button>
                    <Button color="error"
                      onClick={()=>handleDeleteDestinationFromDatabase(destination.id)}
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
          {/** alert snack bar */}
          {/* Alerte de succès */}
          <Snackbar
            open={successAlert}
            autoHideDuration={6000}
            onClose={() => setSuccessAlert(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert onClose={() => setSuccessAlert(false)} severity="success">
              La destination a été suprimé !
            </Alert>
          </Snackbar>
        </div>
      )}
      {editingDestination && (
        <div>
          <button
            className="btn border text-primary mb-3"
            onClick={() => setEditingDestination(null)}
          >
            Go back
          </button>
          <HorizontalTabs index={editingDestination} />
        </div>
      )}


    </Box>
  );
};

export default DestinationList;

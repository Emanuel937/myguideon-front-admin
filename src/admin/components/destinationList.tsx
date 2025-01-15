import React, { useState } from "react";
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
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material";

const mockDatabase = {
  destinations: [
    { id: 1, name: "Paris", country: "France", language: "French", budget: 2000, currency: "EUR", image: "https://cdn.pixabay.com/photo/2021/11/17/15/07/paris-6803796_960_720.jpg" },
    { id: 2, name: "Tokyo", country: "Japan", language: "Japanese", budget: 3000, currency: "JPY", image: "https://via.placeholder.com/150" },
    { id: 3, name: "New York", country: "USA", language: "English", budget: 2500, currency: "USD", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Rio de Janeiro", country: "Brazil", language: "Portuguese", budget: 1500, currency: "BRL", image: "https://via.placeholder.com/150" },
    { id: 5, name: "London", country: "UK", language: "English", budget: 2200, currency: "GBP", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Sydney", country: "Australia", language: "English", budget: 2800, currency: "AUD", image: "https://via.placeholder.com/150" },
    { id: 7, name: "Cairo", country: "Egypt", language: "Arabic", budget: 1000, currency: "EGP", image: "https://via.placeholder.com/150" },
    { id: 8, name: "Cape Town", country: "South Africa", language: "English", budget: 1800, currency: "ZAR", image: "https://via.placeholder.com/150" },
  ],
};

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState(mockDatabase.destinations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);

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

  type Destination = {
    id: number;
    name: string;
    country: string;
    language: string;
    budget: number;
    currency: string;
    image: string;
  };
  
  type DestinationKey = keyof Destination;
  
  const sortedDestinations = React.useMemo(() => {
    if (!sortConfig) return destinations;
  
    return [...destinations].sort((a, b) => {
      const key = sortConfig.key as DestinationKey;
  
      if (a[key] < b[key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [destinations, sortConfig]);



  const filteredDestinations = sortedDestinations.filter(
    (destination) =>
      (!searchQuery || destination.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedLanguage || destination.language === selectedLanguage) &&
      (!selectedCurrency || destination.currency === selectedCurrency)
  );

  const paginatedDestinations = filteredDestinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleLanguageFilterChange = (e: SelectChangeEvent<string>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleCurrencyFilterChange = (e: SelectChangeEvent<string>) => {
    setSelectedCurrency(e.target.value);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (destination: any) => {
    setEditingDestination({ ...destination });
    setOpenDialog(true);
  };

  const handleSaveChanges = () => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest.id === editingDestination.id ? editingDestination : dest
      )
    );
    setOpenDialog(false);
  };

  return (
    <Box padding={2}>
      {/* Barre de recherche et filtres */}
      <Box display="flex" gap={5} marginBottom={2} flexWrap="wrap">
        <Box display="flex" justifyContent={'space-between'}>
        <TextField
          label="Rechercher"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Langue</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={handleLanguageFilterChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Tout</em>
            </MenuItem>
            {[...new Set(destinations.map((d) => d.language))].map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Devise</InputLabel>
          <Select
            value={selectedCurrency}
            onChange={handleCurrencyFilterChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Tout</em>
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

      {/* Tableau */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["name", "country", "language", "budget", "currency"].map((key) => (
                <TableCell key={key} onClick={() => handleSort(key)}>
                  {key.toUpperCase()} {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "⬆️" : "⬇️") : ""}
                </TableCell>
              ))}
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDestinations.map((destination) => (
              <TableRow key={destination.id}>
                  <TableCell>
                  <img src={destination.image} alt={destination.name} width={50} />
                </TableCell>
                <TableCell>{destination.name}</TableCell>
                <TableCell>{destination.country}</TableCell>
                <TableCell>{destination.language}</TableCell>
                <TableCell>{destination.budget}</TableCell>
                <TableCell>{destination.currency}</TableCell>
              
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleEditClick(destination)}
                  >
                    Modifier
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

      {/* Modal */}
      {editingDestination && (
        <Dialog fullScreen open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogActions>
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogContent>
            <TextField
              label="Nom"
              fullWidth
              value={editingDestination.name}
              onChange={(e) =>
                setEditingDestination({ ...editingDestination, name: e.target.value })
              }
            />
            {/* Other fields */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveChanges} variant="contained">
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DestinationList;

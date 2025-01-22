import React, { useState, useEffect } from "react";
import ImageUploader from "./uploadImage";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // Pour afficher une alerte temporaire
import SearchSuggestion from '../components/search_suggestion';
import languagesData from "../constants/lang.json";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import HOSTNAME_WEB from '../constants/hostname';
import axios from "axios";

interface UploadedImage {
  file: File | null;
  preview: string | null;
}

type BasicProps = number | null;

const DestinationBasicInfo = ({ index = null }: { index?: BasicProps }) => {
  const restApiLink = index == null
    ? `${HOSTNAME_WEB}/destination/add/basic/info`
    : `${HOSTNAME_WEB}/destination/update/basic/info/${index}`;

  const [formData, setFormData] = useState({
    destinationName: "",
    language: "English",
    budget: "",
    currency: "USD",
    status: "Draft",
    address: "",
    categories:" "
  });

  const [successAlert, setSuccessAlert]    = useState(false); // État pour l'alerte de succès
  const [weatherImages, setWeatherImages]  = useState<UploadedImage[]>([]);
  const [suggestions, setSuggestions]      = useState<any[]>([]);
  const [languages, setLanguages]          = useState<string[]>([]);
  const [categories, setCategories]        = useState<string[]>([]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setFormData({ ...formData, address: input });

    if (input.length > 2) {
      axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: input, format: "json", addressdetails: 1, limit: 5 },
      })
      .then((response) => setSuggestions(response.data))
      .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (place: any) => {
    setFormData({ ...formData, address: place.display_name });
    setSuggestions([]);
  };

  const handleFileSelect = (file: File | null, type: "weather") => {
    const preview = file ? URL.createObjectURL(file) : null;
    setWeatherImages((prev) => [...prev, { file, preview }]);
  };

  const handleRemoveWeatherImage = (imgIndex: number) => {
    setWeatherImages((prev) => prev.filter((_, i) => i !== imgIndex));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    weatherImages.forEach((img, index) => {
      if (img.file) {
        data.append(`weatherImage_${index}`, img.file);
      }
    });

    try {
      const response = await fetch(restApiLink, {
        method: "POST",
        body: data,
      }).then(
        (res) => {
          setSuccessAlert(true)
          return res.json()
        }
      );
      
      if (response.id) {
        localStorage.setItem('destinationId', response.id);
      } else {
        console.error('Erreur lors de l’ajout :', response);
      }
    } catch (error) {
      console.error("Erreur de réseau : ", error);
    }
  };

  const getCurrentDestination = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination/${index}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = (await response.json()).data.basic_info;
      setFormData({ ...JSON.parse(data) });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async()=>{
    const response =  await fetch(`${HOSTNAME_WEB}/categories`)
    .then((response)=>{
      if(!response.ok){
        throw('there is an error');
      }
      return response.json();

    }).then((response)=>{

      var categoriesArray = response.map((e:any)=>
      {
        return e.categories_name;

      });

      setCategories([...categoriesArray]);

    

    }).catch((error)=>{
      console.log(error);
    })
  
  }

  useEffect(() => {
    fetch("/data/languages.json")
      .then((response) => response.json())
      .then((data) => setLanguages(data.languages))
      .catch(() => console.error("Erreur lors du chargement des langues"));
  
    if (index != null) {
      getCurrentDestination();
    }
  
    fetchCategories();
  }, [index]); // Ajoutez les dépendances nécessaires
  

  useEffect(() => {
    console.log("Mise à jour des catégories : silence");
  }, [categories]);
  

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ marginTop: "10px" }}>
          {/* Nom de la destination */}
          <Grid item xs={12}>
            <TextField
              label="Nom de la destination"
              fullWidth
              name="destinationName"
              value={formData.destinationName}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "white" }}
            />
          </Grid>

          {/* Langue */}
          <Grid item xs={6}>
            <SearchSuggestion
              placeholder="Langue"
              queryData={languagesData.languages}
              name="language"
              value={formData.language}
              handleChange={handleChange}
            />
          </Grid>

          {/* Budget */}
          <Grid item xs={6}>
            <TextField
              label="Budget"
              fullWidth
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              sx={{ backgroundColor: "white" }}
              required
            />
          </Grid>

          {/* Devise */}
          <Grid item xs={6}>
            <TextField
              label="Devise"
              fullWidth
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="JPY">JPY</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </TextField>
          </Grid>

          {/* Statut */}
          <Grid item xs={6}>
            <TextField
              label="Statut"
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleChange}
              select
              required
            >
              {["Published", "Disabled", "Draft", "Pending validation"].map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Adresse */}
          <Grid item xs={6} sx={{ position: "relative" }}>
            <TextField
              label="Adresse/Location"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleLocationChange}
              sx={{ backgroundColor: "white" }}
              required
            />
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: 0,
                  margin: 0,
                  zIndex: 2000,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => handlePlaceSelect(place)}
                    style={{
                      listStyleType: "none",
                      cursor: "pointer",
                      padding: "8px",
                      background: "#f1f1f1",
                      marginBottom: "5px",
                    }}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </Grid>
          <Grid item xs={6}>
            <SearchSuggestion
                placeholder="Type the categories"
                queryData={categories}
                name="categories"
                value={formData.categories}
                handleChange={handleChange}
              />
          </Grid>
          {/* Images météo */}
          <Grid item xs={12}>
            <ImageUploader
              label="Ajouter une image météo"
              onFileSelect={(file) => handleFileSelect(file, "weather")}
            />
            <Box display="flex" gap={2} flexWrap="wrap">
              {weatherImages.map((img, index) => (
                <Box key={index} position="relative" mt={2}>
                  <img
                    src={img.preview || ""}
                    alt={`Weather ${index + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveWeatherImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  >
                    X
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Soumettre */}
          <Grid item xs={12} mt={3}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#293746" }}>
              {index ? "Mettre à jour" : "Enregistrer"} les informations
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Alerte de succès */}
      <Snackbar
        open={successAlert}
        autoHideDuration={6000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSuccessAlert(false)} severity="success">
          La destination a été sauvegardée avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DestinationBasicInfo;

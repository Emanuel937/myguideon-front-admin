import React, { useState } from "react";
import ImageUploader from './uploadImage'
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

interface UploadedImage {
  file: File | null;
  preview: string | null;
}

// Composant principal
const DestinationBasicInfo = () => {
  const [formData, setFormData] = useState({
    destinationName: "",
    language: "",
    budget: "",
    currency: "USD",
  });

  const [coverImage, setCoverImage] = useState<UploadedImage>({
    file: null,
    preview: null,
  });

  const [weatherImages, setWeatherImages] = useState<UploadedImage[]>([]);

  const handleFileSelect = (file: File | null, type: "cover" | "weather") => {
    const preview = file ? URL.createObjectURL(file) : null;
    if (type === "cover") {
      setCoverImage({ file, preview });
    } else {
      setWeatherImages((prev) => [...prev, { file, preview }]);
    }
  };

  const handleRemoveWeatherImage = (index: number) => {
    setWeatherImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Cover Image:", coverImage.file);
    console.log("Weather Images:", weatherImages.map((img) => img.file));
  };

  return (
    <Box display="flex" sx={{pt: 3}}>
    <Box sx={{  borderRadius: 2 }} flex='60%' pt={2}>
      {/* Barre d'actions */}
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Soumettre
          </Button>
      <form onSubmit={handleSubmit}>
        {/* Nom de la destination */}
        <TextField
          label="Nom de la destination"
          variant="outlined"
          fullWidth
          margin="normal"
          name="destinationName"
          value={formData.destinationName}
          onChange={handleChange}
          required
        />

        {/* Langue */}
        <TextField
          label="Langue"
          variant="outlined"
          fullWidth
          margin="normal"
          name="language"
          value={formData.language}
          onChange={handleChange}
          select
          required
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">Anglais</MenuItem>
          <MenuItem value="es">Espagnol</MenuItem>
          <MenuItem value="de">Allemand</MenuItem>
        </TextField>

        {/* Budget et devise */}
        <Box display="flex" gap={2}>
          <TextField
            label="Budget"
            variant="outlined"
            fullWidth
            margin="normal"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            type="number"
            required
          />
          <TextField
            label="Devise"
            variant="outlined"
            margin="normal"
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
        </Box>

        {/* Upload Cover Image */}
        <ImageUploader
          label="Image de couverture"
          onFileSelect={(file) => handleFileSelect(file, "cover")}
        />
        {coverImage.preview && (
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight="bold">
              Aperçu :
            </Typography>
            <img
              src={coverImage.preview}
              alt="Cover Preview"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </Box>
        )}

        {/* Upload Weather Images */}
        <Typography variant="subtitle1" mt={3} fontWeight="bold">
          Images météo
        </Typography>
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
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Button
                size="small"
                onClick={() => handleRemoveWeatherImage(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "error.main",
                  color: "white",
                  ":hover": { bgcolor: "error.red" },
                }}
              >
                X
              </Button>
            </Box>
          ))}
        </Box>
      </form>
    </Box>
    <Box flex='40%'>
        {/** this is the flex display  */}
    </Box>
    </Box>
  );
};

export default DestinationBasicInfo;

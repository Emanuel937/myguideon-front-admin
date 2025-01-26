import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import ImageUploader from "./uploadImage"; // Le composant d'upload que vous avez fourni
import HOSTNAME_WEB from "../constants/hostname";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  isCover: boolean; // Nouvelle propriété pour indiquer si l'élément est défini comme "cover"
  file: File; // Fichier réel pour l'envoi au serveur
}


type basicPros = number | null ;

const Media =  ({ index = null }: { index?: basicPros })  => {
  const [mediaList, setMediaList]          = useState<MediaItem[]>([]);
  const [viewMode, setViewMode]            = useState<"grid" | "list">("grid");
  const [coverId, setCoverId]              = useState<string | null>(null); // ID de l'image "cover"
  var destinationId: number | null         = null;
  destinationId                            =  Number(localStorage.getItem('destinationId'));
  const [coverName, setCoverName]          = useState(" ");

  // Charger les fichiers stockés dans la session au démarrage
  useEffect(() => {
    // get the destinationId

    const savedMedia = sessionStorage.getItem("mediaList");
    if (savedMedia) {
      setMediaList(JSON.parse(savedMedia));
    }
  }, []);

  // Sauvegarder dans la session chaque fois que `mediaList` change
  useEffect(() => {
    sessionStorage.setItem("mediaList", JSON.stringify(mediaList));
    
  }, [mediaList]);

  const handleUpload = (file: File | null) => {
    if (!file) return;

    const newMedia: MediaItem = {
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type.startsWith("image") ? "image" : "video",
      url: URL.createObjectURL(file), // Génère une URL locale pour afficher le fichier
      isCover: false, // Par défaut, aucun fichier n'est "cover"
      file, // Stocke le fichier réel pour l'envoi
    };

    setMediaList((prev) => [...prev, newMedia]);
  };

  const handleDelete = (id: string) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
    if (id === coverId) {
      setCoverId(null); // Supprimer la couverture si elle est supprimée
    }
  };
  const handleSetCover = (id: string) => {
    setCoverId(id); // Mettre à jour uniquement l'ID de couverture
    setMediaList((prev) =>
      prev.map((item) => {
      if(item.id == id){
        setCoverName(item.name);
      }
      return ({
        ...item,
        isCover: item.id === id,
      })
    }
    )
    );
  };
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      mediaList.forEach((item) => {
        formData.append("files", item.file); // Ajouter le fichier
        formData.append("names", item.name); // Ajouter le nom
      });
      if (coverId) {
        formData.append("cover", coverName); // Inclure le nom du fichier défini comme couverture
      }
      
      if(index == null){
        destinationId = destinationId;
        
      }else{
        destinationId = index;
      }
      
      const response = await fetch(`${HOSTNAME_WEB}/destination/update/gallery/${destinationId}`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        setMediaList([]);
        sessionStorage.removeItem("mediaList");
        setCoverId(null);
      } else {
        throw new Error("Erreur lors de l'envoi des fichiers.");
      }
    } catch (error) {
      console.error("Erreur :", error);

    }
  };
  

  return (
    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2, position: "relative" }}>
  

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Media Library</Typography>
        <Box>
          <Button
            startIcon={<ViewModuleIcon />}
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "contained" : "outlined"}
            sx={{ mr: 1 }}
          >
            Grid
          </Button>
          <Button
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "contained" : "outlined"}
            sx={{ mr: 1 }}
          >
            List
          </Button>
              {/* Bouton Submit en haut */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          zIndex: 1000,
        }}
        disabled={mediaList.length === 0} // Désactiver si aucun média
      >
        Submit
      </Button>
        </Box>
      </Box>

      {/* Uploader */}
      <Box sx={{ mb: 3 }}>
        <ImageUploader label="Upload Media" onFileSelect={handleUpload} />
      </Box>

      {/* Media Display */}
      {viewMode === "grid" ? (
        <Grid container spacing={2}>
          {mediaList.map((item) => (
            <Grid item xs={6} sm={4} md={5} key={item.id}>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                  "&:hover": { boxShadow: 3 },
                }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      display: "block",
                    }}
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                )}
                {/* Checkbox pour définir comme "cover" */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.id === coverId}
                      onChange={() => handleSetCover(item.id)}
                    />
                  }
                  label="Cover"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 1,
                    px: 1,
                  }}
                />
                {/* Bouton Supprimer */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                  }}
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {mediaList.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Avatar
                variant="square"
                src={item.url}
                alt={item.name}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <ListItemText primary={item.name} />
              {/* Checkbox pour définir comme "cover" */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.id === coverId}
                    onChange={() => handleSetCover(item.id)}
                  />
                }
                label="Cover"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Media;

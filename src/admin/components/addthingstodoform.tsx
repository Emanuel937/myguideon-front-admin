import React, { useEffect, useState } from 'react';
import { TextField, Button, IconButton, Box, Grid, Typography, Divider, Alert } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import HOSTNAME_WEB from '../constants/hostname';
import axios from "axios";


// Définir le type des props
interface AddThingsToDoFormProps {
  index: number|null|string;
}


const AddThingsToDoForm: React.FC<AddThingsToDoFormProps> = ({ index }) => {
  return <ActivityForm  index={index}/>;
}

type Activity = {
  id:number|null|string,
  name: string; // Nom de l'activité
  description: string; // Description de l'activité
  address: string; // Adresse de l'activité
  icon: File | string | null; // Icône de l'activité (peut être un fichier ou une URL)
  destination_name: string; // Nom de la destination
  gallery: File[] | string[] | null; // Galerie peut contenir plusieurs fichiers ou URLs d'images
};


const ActivityForm: React.FC<AddThingsToDoFormProps> = ({index}) => {

  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    id:null,
    name: '',
    description: '',
    address: '',
    icon: null,
    destination_name: '', // Ensuring the destination field is kept
    gallery: null,
  });
  
  useEffect(() => {
    if (index !== null) {
      const fetchActivityData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${HOSTNAME_WEB}/activities/${index}`);
          const activity = response.data[0];
          console.log(response);

          setCurrentActivity({
            id: activity.id,
            name: activity.name || '',
            description: activity.description || '',
            address: activity.adress || '',
            icon: `${HOSTNAME_WEB}/public/uploads/destination/activities/${activity.icon}`, // L'icône ne peut pas être directement chargée dans File, à gérer si nécessaire
            destination_name: activity.destination_name || '',
            gallery: null, // Idem pour la galerie
          });
        } catch (error) {
          console.error("Erreur lors de la récupération de l'activité", error);
        } finally {
          setLoading(false);
        }
       
      };

      fetchActivityData();
    }
  }, [index]);

  // Suggestions de lieux
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddActivity = () => {
    if (currentActivity.name && currentActivity.description && currentActivity.address && currentActivity.icon && currentActivity.destination_name) {
      if (editingIndex !== null) {
        // Update an existing activity
        const updatedActivities = [...activities];
        updatedActivities[editingIndex] = currentActivity;
        setActivities(updatedActivities);
        setEditingIndex(null);
      } else {
        // Add a new activity
        setActivities([...activities, currentActivity]);
      }

      setCurrentActivity({
        id:null,
        name: '',
        description: '',
        address: '',
        icon: null,
        destination_name: '',
        gallery: null,
      }); // Reset the form
    }
  };

  // Recherche de lieux dans Nominatim d'OpenStreetMap
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCurrentActivity({
      ...currentActivity,
      address: input,
    });

    if (input.length > 2) {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: input,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        })
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche de lieu", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Fonction pour sélectionner un lieu et remplir le champ "Location"
  const handlePlaceSelect = (place: any) => {
    setCurrentActivity({
      ...currentActivity,
      address: place.display_name, // Utiliser le nom complet du lieu sélectionné
    });
    setSuggestions([]); // Réinitialiser les suggestions après sélection
  };

  const handleRemoveActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  const handleEditActivity = (index: number) => {
    setCurrentActivity(activities[index]);
    setEditingIndex(index);
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentActivity({ ...currentActivity, icon: file });
    }
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const galleryFiles = Array.from(files);
      setCurrentActivity({ ...currentActivity, gallery: galleryFiles });
    }
  };

  const handleChange = (field: keyof Activity, value: string) => {
    setCurrentActivity({ ...currentActivity, [field]: value });
  };

  // Ajoutez les fichiers dans FormData
  const handleSaveToDatabase = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      activities.forEach((activity, index) => {
        formData.append(`activities[${index}][name]`, activity.name);
        formData.append(`activities[${index}][description]`, activity.description);
        formData.append(`activities[${index}][address]`, activity.address);
        formData.append(`activities[${index}][destination_name]`, activity.destination_name); // Destination name
        if (activity.icon) {
          formData.append('icon', activity.icon);  // Correspond au champ icon dans Multer
        }
        if (activity.gallery) {
          activity.gallery.forEach((file, i) => {
            formData.append('gallery', file);  // Correspond au champ gallery dans Multer
          });
        }
      });

      const response = await fetch(`${HOSTNAME_WEB}/activities/add`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Données enregistrées avec succès !');
        setActivities([]);
      } else {
        alert('Une erreur est survenue lors de l’enregistrement.');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur de communication avec le serveur.');
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateActivities = async(index:string)=>{
    const id = index;
    handleAddActivity();
    setLoading(true);

    try {
      const formData = new FormData();
      activities.forEach((activity, index) => {
        formData.append(`activities[${index}][name]`, activity.name);
        formData.append(`activities[${index}][description]`, activity.description);
        formData.append(`activities[${index}][address]`, activity.address);
        formData.append(`activities[${index}][destination_name]`, activity.destination_name); // Destination name
        if (activity.icon) {
          formData.append('icon', activity.icon);  // Correspond au champ icon dans Multer
        }
        if (activity.gallery) {
          activity.gallery.forEach((file, i) => {
            formData.append('gallery', file);  // Correspond au champ gallery dans Multer
          });
        }
      });

      const response = await fetch(`${HOSTNAME_WEB}/activities/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Données enregistrées avec succès !');
        setActivities([]);
      } else {
        alert('Une erreur est survenue lors de l’enregistrement.');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur de communication avec le serveur.');
    } finally {
      setLoading(false);
    }
  }
  

  // Utiliser un gestionnaire synchrone pour l'événement onClick
    const handleClick = (id: string) => {
      // Appel de la fonction async dans un contexte synchrone
      handleUpdateActivities(id.toString());
    };

  return (
    <Box display={'flex'}>
      <Box flex={5} sx={{ padding: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>
          Add things to do
        </Typography>
        <Divider sx={{ borderBottomWidth: 1, borderColor: 'gray' }} />

        <Alert variant="filled" severity="info" sx={{ marginTop: '10px', marginBottom: '20px' }}>
          <strong>Note: </strong>This is the meteo information about the destinations, to set the cover image, please go to <strong>Gallery section</strong>
        </Alert>

        <Grid container spacing={3}>
          {/* Nom de l'activité */}
          <Grid item xs={12}>
            <TextField
              className='form-control'
              label="Nom de l'activité"
              variant="outlined"
              fullWidth
              value={currentActivity.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={6} >
            <input className='form-control'
              placeholder="Destination"
              list="options" id="search" name="search"
              value={currentActivity.destination_name}
              onChange={(e) => handleChange('destination_name', e.target.value)} // Handle destination_name
            />
            <datalist id="options">
              <option value="Pomme" />
            </datalist>
          </Grid>

          {/* Adresse de l'activité */}
          <Grid item xs={6} sx={{position:'relative'}}>
            <TextField
              className='form-control'
              label="Adresse de l'activité"
              variant="outlined"
              fullWidth
              value={currentActivity.address}
              onChange={handleLocationChange} // Appeler la fonction directement
            />
            {/* Afficher les suggestions de lieux */}
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%", // Positionner juste en dessous du champ
                  left: 0,
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: 0,
                  margin: 0,
                  zIndex: 2000, // Assurer que les suggestions sont au-dessus des autres éléments
                  maxHeight: "200px", // Limiter la hauteur pour éviter que la liste prenne trop de place
                  overflowY: "auto",
                }}
              >
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => handlePlaceSelect(place)} // Sélectionner un lieu
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

          {/* Description de l'activité */}
          <Grid item xs={12}>
            <TextField
              className='form-control'
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={currentActivity.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* Icône de l'activité */}
          <Grid item xs={3}>
            <Button variant="contained" component="label">
              <i className="bi bi-upload"></i> icône
              <input type="file" hidden accept="image/*" onChange={handleIconUpload} name="icon" />
            </Button>
            {currentActivity.icon && (
              <Box sx={{ marginTop: 2 }}>
                <img
                   src={typeof currentActivity.icon === 'string' 
                    ? currentActivity.icon 
                    : currentActivity.icon && URL.createObjectURL(currentActivity.icon)}
                  alt="Activity Icon"
                  style={{ width: 50, height: 50 }}
                />
              </Box>
            )}
          </Grid>

          {/* Galerie de l'activité */}
          <Grid item xs={3}>
            <Button variant="contained" component="label">
              <i className="bi bi-upload"></i> images
              <input type="file" hidden accept="image/*" onChange={handleGalleryUpload} multiple name="gallery" />
            </Button>
            {currentActivity.gallery && (
              <Box sx={{ marginTop: 2 }}>
                {currentActivity.gallery.map((file, index) => (
                 <img
                 key={index}
                 src={
                   currentActivity.icon instanceof File
                     ? URL.createObjectURL(currentActivity.icon) // Crée un URL si icon est un fichier
                     : typeof currentActivity.icon === 'string'
                     ? currentActivity.icon // Utilise directement l'URL si icon est une chaîne
                     : undefined // Si icon est null ou undefined
                 }
                 alt={`Gallery Image ${index + 1}`}
                 style={{ width: 50, height: 50, marginRight: 10 }}
               />
               
                ))}
              </Box>
            )}
          </Grid>
           {/* Ajouter ou Mettre à Jour une activité */}
            { index == null
              &&
                  <Grid item xs={6}>
                    <Button variant="contained" sx={{ backgroundColor: 'gray' }} onClick={handleAddActivity}>
                      {editingIndex !== null ? 'Mettre à jour l\'activité' : 'Ajouter l\'activité'}
                    </Button>
                  </Grid>
              }
         
            { index == null
              &&
              (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveToDatabase}
                    disabled={loading || activities.length === 0}
                  >
                {loading ? 'Enregistrement...' : 'Enregistrer les activités'}
                </Button>
              </Grid> 
           )
          }
          {/* Bouton Enregistrer */}

          {index &&
          <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={() => {
                  if (currentActivity.id) {
                    handleClick(currentActivity.id.toString());
                  } else {
                    console.error("ID is null or undefined");
                  }
                }}
              >
                Mettre à jour
              </Button>

            </Grid>

          }
        </Grid>
      </Box>

      <Box flex={3} p={4} mt={5}>
        {/* Liste des activités */}
        <Grid item xs={12}>
          {activities.length > 0 && (
            <Box>
              <Typography variant="h6" mb={2}>Liste des Activités</Typography>
              <Typography sx={{ fontSize: '14px', color: 'gray' }}>
                List of all activities, all these activities will be linked with selected destinations ...
              </Typography>
              {activities.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, marginTop: 2 }}>
                  <Box sx={{ marginRight: 2 }}>
                    <img
                        src={
                          activity.icon instanceof File
                            ? URL.createObjectURL(activity.icon) // Crée un URL si icon est un fichier
                            : typeof activity.icon === 'string'
                            ? activity.icon // Utilise directement l'URL si icon est une chaîne
                            : undefined // Si icon est null ou undefined
                        }
                        alt="Activity Icon"
                        style={{ width: 40, height: 40 }}
                      />
                  </Box>
                  <Divider />
                  <Box sx={{ flexGrow: 1 }}>
                    <p><strong>{activity.name}</strong></p>
                  </Box>
                  <IconButton onClick={() => handleEditActivity(index)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveActivity(index)}>
                    <Delete color="secondary" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default AddThingsToDoForm;

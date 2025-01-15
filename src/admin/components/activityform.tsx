import React, { useState } from 'react';
import { TextField, Button, IconButton, Box, Grid, InputLabel, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AddCircle, Delete, Edit } from '@mui/icons-material';

type Activity = {
  name: string;
  description: string;
  address: string;
  icon: File | null;
  iconUrl: string;
};

const ActivityForm: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    name: '',
    description: '',
    address: '',
    icon: null,
    iconUrl: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddActivity = () => {
    if (currentActivity.name && currentActivity.description && currentActivity.address && currentActivity.iconUrl) {
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
      setCurrentActivity({ name: '', description: '', address: '', icon: null, iconUrl: '' }); // Reset the form
    }
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
      const iconUrl = URL.createObjectURL(file);
      setCurrentActivity({ ...currentActivity, icon: file, iconUrl });
    }
  };

  const handleChange = (field: keyof Activity, value: string) => {
    setCurrentActivity({ ...currentActivity, [field]: value });
  };

  const handleSaveToDatabase = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      activities.forEach((activity, index) => {
        formData.append(`activities[${index}][name]`, activity.name);
        formData.append(`activities[${index}][description]`, activity.description);
        formData.append(`activities[${index}][address]`, activity.address);
        if (activity.icon) {
          formData.append(`activities[${index}][icon]`, activity.icon);
        }
      });

      const response = await fetch('/api/activities', {
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ajouter des Activités
      </Typography>
      <Grid container spacing={3}>
        {/* Nom de l'activité */}
        <Grid item xs={12}>
          <TextField
            label="Nom de l'activité"
            variant="outlined"
            fullWidth
            value={currentActivity.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Grid>

        {/* Description de l'activité */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={currentActivity.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </Grid>

        {/* Adresse de l'activité */}
        <Grid item xs={12}>
          <TextField
            label="Adresse de l'activité"
            variant="outlined"
            fullWidth
            value={currentActivity.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </Grid>

        {/* Icône de l'activité */}
        <Grid item xs={12}>
          <InputLabel>Choisir une icône pour l'activité</InputLabel>
          <Button variant="contained" component="label">
            Téléverser une icône
            <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
          </Button>
          {currentActivity.iconUrl && (
            <Box sx={{ marginTop: 2 }}>
              <img src={currentActivity.iconUrl} alt="Activity Icon" style={{ width: 50, height: 50 }} />
            </Box>
          )}
        </Grid>

        {/* Ajouter ou Mettre à Jour une activité */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddActivity}>
            {editingIndex !== null ? 'Mettre à jour l\'activité' : 'Ajouter l\'activité'}
          </Button>
        </Grid>

        {/* Liste des activités */}
        <Grid item xs={12}>
          {activities.length > 0 && (
            <Box>
              <Typography variant="h6">Liste des Activités</Typography>
              {activities.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <Box sx={{ marginRight: 2 }}>
                    <img src={activity.iconUrl} alt="Activity Icon" style={{ width: 40, height: 40 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <p><strong>{activity.name}</strong></p>
                    <p>{activity.description}</p>
                    <p>{activity.address}</p>
                  </Box>
                  <IconButton color="primary" onClick={() => handleEditActivity(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemoveActivity(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Bouton Enregistrer */}
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
      </Grid>
    </Box>
  );
};

export default ActivityForm;

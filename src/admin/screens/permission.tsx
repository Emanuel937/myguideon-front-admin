import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tab,
  Tabs,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import HOSTNAME_WEB from '../constants/hostname';
import { data } from 'react-router-dom';

// Liste des permissions
const permissionsList = [
  { id: 1, name: 'View Destination' },
  { id: 2, name: 'Edit Destination' },
  { id: 3, name: 'Delete Destination' },
  { id: 4, name: 'Publish Destination' },
  { id: 5, name: 'Manage Reviews' },
];

type Profile = {
  id: number;
  name: string;
  permissions: number[]; // Liste des permissions
};

type TeamMember = {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  profileId: number; // Associe un membre à un profil
};

export default function ProfilePermissionsManager() {
  const [currentTab, setCurrentTab] = useState('1'); // Onglet actif
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Gérer le changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setCurrentProfile(null); // Réinitialiser le profil sélectionné lorsque l'on change d'onglet
  };
  
  // add profil and permission 
  const handleFetchDataAddprofil = async(profil:Profile)=>
  {  
    const response =  await fetch(`${HOSTNAME_WEB}/profil/add`,
        {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profil), 
        }
    )
    .then((response)=>{
      if(!response.ok){
        throw new Error(`Erreu from server`);
      }else{
       
      }
    });
   
  }
  // Ajouter un profil
  const handleAddProfile = () => {
    if (!newProfileName || selectedPermissions.length === 0) {
      alert('Veuillez entrer un nom et sélectionner au moins une permission.');
      return;
    }

    const newProfile: Profile = {
      id: profiles.length + 1,
      name: newProfileName,
      permissions: selectedPermissions,
    };
   
    setProfiles([...profiles, newProfile]);
    // make fetch request to save profile to database;
    handleFetchDataAddprofil(newProfile);

    setNewProfileName('');
    setSelectedPermissions([]);
    handleSnackbar('Profil créé avec succès!');
  };

  // Gérer la sélection des permissions
  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = Number(event.target.value);
    if (event.target.checked) {
      setSelectedPermissions((prev) => [...prev, permissionId]);
    } else {
      setSelectedPermissions((prev) => prev.filter((id) => id !== permissionId));
    }
  };
  // update permissition 
  const handleProfilePermissionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = Number(event.target.value); // Récupère l'ID de la permission
    let currentProfileP: any = currentProfile?.permissions; // Récupère les permissions actuelles
  
    // Si les permissions sont une chaîne, convertir en tableau
    if (typeof currentProfileP === 'string') {
      try {
        currentProfileP = JSON.parse(currentProfileP);
      } catch (error) {
        console.error("Erreur lors de l'analyse des permissions :", error);
        return;
      }
    }
  
    // Assurez-vous que les permissions sont bien un tableau
    if (!Array.isArray(currentProfileP)) {
      console.error("Les permissions doivent être un tableau :", currentProfileP);
      return;
    }
  
    // Ajouter ou retirer la permission
    if (currentProfileP.includes(permissionId)) {
      const index = currentProfileP.indexOf(permissionId);
      currentProfileP.splice(index, 1); // Retirer
    } else {
      currentProfileP.push(permissionId); // Ajouter
    }
  
    // Mettre à jour le profil
    setCurrentProfile({
      id: currentProfile!.id,
      name: currentProfile!.name,
      permissions: currentProfileP,
    });
  
    console.log("Profil mis à jour :", currentProfile);
  };
  
  
  

  // Gérer le clic sur un profil dans l'onglet permissions
  const handleProfileClick = (profile: Profile) => {
    setCurrentProfile(profile);
  };

  // Sauvegarder les permissions d'un profil
  const handleSavePermissions = () => {
    if (currentProfile) {
      const updatedProfiles = profiles.map((profile) =>
       { 
        // update the profil on data
         return  profile.id === currentProfile.id ? currentProfile : profile
       }
      );
      setProfiles(updatedProfiles);
      handleUpdatePermissions(currentProfile.id, currentProfile.permissions);
      handleSnackbar('Permissions mises à jour avec succès.');
    }
  };

  // Ajouter un membre à l'équipe


  // Supprimer un profil
  const handleDeleteProfile = async(profileId: number) => {
    
    await fetch(`${HOSTNAME_WEB}/profil/delete/${profileId}`, {
      method:'DELETE',
    });

    const updatedProfiles = profiles.filter((profile) => profile.id !== profileId);
    setProfiles(updatedProfiles);
    handleSnackbar('Profil supprimé avec succès!');
    handleShowProfil();

  };

  // Supprimer un membre d'équipe
  const handleDeleteTeamMember = (memberId: number) => {
    const updatedTeamMembers = teamMembers.filter((member) => member.id !== memberId);
    setTeamMembers(updatedTeamMembers);
    handleSnackbar('Membre d\'équipe supprimé avec succès!');
  };

  // Ouvrir le Snackbar
  const handleSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleShowProfil = async()=>{
      const response = await fetch(`${HOSTNAME_WEB}/profil`)
      .then((response)=>{
          if(!response.ok){
            throw(" there is an error .... ");
      }
      return response.json();
    }).then((data)=>{
        
        var profilFromData = setProfiles(data.message.map((e: Profile) => ({ ...e })));
        console.log(profilFromData);
   
      })
      .catch((error)=>{
        console.log(error)
      })
  }
const handleUpdatePermissions= async(profilID:number, permissions:number[])=>{


   console.log("permissions is  : .... ");

  console.log(permissions);
    const response = fetch(`${HOSTNAME_WEB}/profil/update/${profilID}`,
      {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json', // Ajout de l'en-tête pour spécifier que le corps est en JSON
        },
        body: JSON.stringify({ permissions })
      }
    ).then((response)=> {
          if(!response.ok){
            throw("there is an error");
          }else{
            handleShowProfil();
          }
          return response.json();
      }
     
    ).catch((error)=>{
      console.log(error);
    })
}
  useEffect(() => {
    handleShowProfil();
    // Initialize profil
  }, []); 



  const handleAddTeamMember = async () => {
    if (!newMemberName || !newMemberEmail || !newMemberPassword || !newMemberAvatar || selectedProfileId === null) {
      alert('Veuillez entrer un nom, email, mot de passe, avatar et sélectionner un profil.');
      return;
    }
  
    // Fonction pour envoyer les données à l'API
    const fetchData = async (data: any) => {
      try {
        const response = await fetch(`${HOSTNAME_WEB}/profil/add/user/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Important pour JSON
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`Erreur API : ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log('Réponse API :', result);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du membre :', error);
        alert('Une erreur s\'est produite lors de l\'ajout du membre.');
      }
    };
  
    // Création d'un nouvel objet membre
    const newMember: TeamMember = {
      id: teamMembers.length + 1, // ID fictif basé sur la longueur actuelle
      name: newMemberName,
      email: newMemberEmail,
      password: newMemberPassword,
      avatar: newMemberAvatar,
      profileId: selectedProfileId,
    };
  
    // Mise à jour de l'état local
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPassword('');
    setNewMemberAvatar('');
    setSelectedProfileId(null);
    handleSnackbar('Membre ajouté avec succès!');
  
    // Envoi des données à l'API
    await fetchData(newMember);
  };
  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des Profils, Permissions et Équipe
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Tabs for Profiles, Permissions, and Team">
          <Tab label="Permissions" value="1" />
          <Tab label="Profils" value="2" />
          <Tab label="Équipe" value="3" />
        </Tabs>
      </Box>

      {/* Permissions Tab */}
      {currentTab === '1' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Gérer les Permissions
          </Typography>

          {/* Liste des profils */}
          <Typography variant="h6" gutterBottom>
            Profils Existants
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom du Profil</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} onClick={() => handleProfileClick(profile)}>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleProfileClick(profile)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteProfile(profile.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Si un profil est sélectionné, afficher ses permissions */}
          {currentProfile && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Permissions de {currentProfile.name}
              </Typography>
              <FormGroup>
                {permissionsList.map((permission) => (
                  <FormControlLabel
                    key={permission.id}
                    control={
                      <Checkbox
                        value={permission.id.toString()}
                        onChange={handleProfilePermissionsChange}
                        checked={currentProfile.permissions.includes(permission.id)}
                      />
                    }
                    label={permission.name}
                  />
                ))}
              </FormGroup>
              <Button variant="contained" onClick={handleSavePermissions} sx={{ mt: 2 }}>
                Sauvegarder les Permissions
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Profils Tab */}
      {currentTab === '2' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ajouter un Profil
          </Typography>
          <TextField
            fullWidth
            label="Nom du Profil"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            margin="normal"
          />
          <FormGroup>
            {permissionsList.map((permission) => (
              <FormControlLabel
                key={permission.id}
                control={
                  <Checkbox
                    value={permission.id.toString()}
                    onChange={handlePermissionChange}
                    checked={selectedPermissions.includes(permission.id)}
                  />
                }
                label={permission.name}
              />
            ))}
          </FormGroup>
          <Button variant="contained" onClick={handleAddProfile} sx={{ mt: 2 }}>
            Ajouter le Profil
          </Button>
        </Box>
      )}

      {/* Équipe Tab */}
      {currentTab === '3' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ajouter un Membre à l'Équipe
          </Typography>
          <TextField
            fullWidth
            label="Nom du Membre"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mot de Passe"
            type="password"
            value={newMemberPassword}
            onChange={(e) => setNewMemberPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Avatar (URL)"
            value={newMemberAvatar}
            onChange={(e) => setNewMemberAvatar(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Sélectionner un Profil"
            select
            value={selectedProfileId || ''}
            onChange={(e) => setSelectedProfileId(Number(e.target.value))}
            margin="normal"
          >
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleAddTeamMember} sx={{ mt: 2 }}>
            Ajouter le Membre
          </Button>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Membres de l'Équipe
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom du Membre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Profil</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{profiles.find((profile) => profile.id === member.profileId)?.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteTeamMember(member.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/* Snackbar pour les messages de confirmation */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

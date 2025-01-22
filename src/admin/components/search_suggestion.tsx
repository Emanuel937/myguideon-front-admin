import React, { useState } from "react";
import { Box, TextField, List, ListItem, ListItemButton, ListItemText } from "@mui/material";


interface SearchSuggestionInterface {
    placeholder:string,
    name:string;
    queryData :string[];
    value:string;
    handleChange:(e: React.ChangeEvent<HTMLInputElement>) => void
}
   
const SearchSuggestion:React.FC <SearchSuggestionInterface> = ({placeholder, name, queryData, handleChange, value})=>{

  const [query, setQuery] = useState(""); // État pour la valeur de l'entrée
  const [suggestions, setSuggestions] = useState<string[]>([]); // État pour les suggestions

  // Données locales pour l'exemple
  const locations = queryData;

  // Fonction pour gérer la saisie utilisateur
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);
    handleChange(e);
  

    // Afficher des suggestions si l'entrée est plus longue que 2 caractères
    if (input.length > 2) {
      const filteredSuggestions = locations.filter((location) =>
        location.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Réinitialiser les suggestions si le texte est court
    }
  };

  // Fonction pour sélectionner une suggestion
  const handleSuggestionClick = (suggestion: string) => {
    
    setQuery(suggestion); // Mettre à jour le champ de recherche avec la suggestion
    setSuggestions([]); // Vider les suggestions
  };

  return (
    <Box sx={{position:'relative'}}>
      {/* Champ de recherche */}
      <TextField
        fullWidth
        label={placeholder}
        variant="outlined"
        value={value}
        onChange={handleSearchChange}
        placeholder={placeholder}
        name={name}
        className="bg-white"
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <List className="bg-white" sx={{ border: "1px solid #ccc", borderRadius: "5px", marginTop: "10px" , position:"absolute", top:"100%" , zIndex:"500", left:"0", right:0}}>
          {suggestions.map((suggestion, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleSuggestionClick(suggestion)}>
                <ListItemText primary={suggestion} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchSuggestion;


import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

type Category = {
  id: number;
  name: string;
  description: string;
  image: File | null;
  imageUrl: string;
  parentId: number | null;
};

const fakeDatabase = {
  categories: [] as Category[],
  createCategory(category: Category) {
    this.categories.push(category);
  },
  updateCategory(updatedCategory: Category) {
    this.categories = this.categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
  },
  deleteCategory(id: number) {
    this.categories = this.categories.filter((category) => category.id !== id);
  },
  getCategories() {
    return this.categories;
  },
};

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category>({
    id: Date.now(),
    name: '',
    description: '',
    image: null,
    imageUrl: '',
    parentId: null,
  });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    // Charger les catégories depuis la base de données simulée
    setCategories(fakeDatabase.getCategories());
  }, []);

  const handleAddOrUpdateCategory = () => {
    if (!currentCategory.name) return;

    if (editingCategoryId !== null) {
      // Mise à jour
      fakeDatabase.updateCategory(currentCategory);
      setEditingCategoryId(null);
    } else {
      // Ajout
      fakeDatabase.createCategory({ ...currentCategory, id: Date.now() });
    }

    setCategories(fakeDatabase.getCategories());
    resetForm();
  };

  const resetForm = () => {
    setCurrentCategory({
      id: Date.now(),
      name: '',
      description: '',
      image: null,
      imageUrl: '',
      parentId: null,
    });
  };

  const handleEditCategory = (id: number) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    if (categoryToEdit) {
      setCurrentCategory(categoryToEdit);
      setEditingCategoryId(id);
    }
  };

  const handleDeleteCategory = (id: number) => {
    fakeDatabase.deleteCategory(id);
    setCategories(fakeDatabase.getCategories());
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCurrentCategory({ ...currentCategory, image: file, imageUrl });
    }
  };

  const renderCategoryTree = (parentId: number | null) => {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => (
        <Box key={category.id} sx={{ marginLeft: parentId ? 4 : 0, marginBottom: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {category.name}
              </Typography>
              <Typography variant="body2">{category.description}</Typography>
              {category.imageUrl && <img src={category.imageUrl} alt={category.name} style={{ width: 50, height: 50 }} />}
            </Box>
            <Box>
              <IconButton color="primary" onClick={() => handleEditCategory(category.id)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteCategory(category.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
          {renderCategoryTree(category.id)}
        </Box>
      ));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Catégories
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Nom de la catégorie"
            variant="outlined"
            fullWidth
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={currentCategory.description}
            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel>Choisir une image pour la catégorie</InputLabel>
          <Button variant="contained" component="label">
            Téléverser une image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          {currentCategory.imageUrl && (
            <Box sx={{ marginTop: 2 }}>
              <img src={currentCategory.imageUrl} alt="Category" style={{ width: 50, height: 50 }} />
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Catégorie Parent</InputLabel>
            <Select
              value={currentCategory.parentId || ''}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  parentId: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">Aucune</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddOrUpdateCategory}>
            {editingCategoryId !== null ? 'Mettre à jour la catégorie' : 'Ajouter la catégorie'}
          </Button>
          <Button variant="outlined" color="secondary" sx={{ marginLeft: 2 }} onClick={resetForm}>
            Réinitialiser
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Liste des Catégories
          </Typography>
          {renderCategoryTree(null)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryManager;

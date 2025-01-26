import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import HOSTNAME_WEB from "../constants/hostname";

// Type pour les données utilisateur
interface User {
  id: number;
  name: string;
}

// Type pour la réponse du serveur
interface ServerResponse {
  success: boolean;
  user?: User;
  message?: string;
}

const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage: "url('https://cdn.pixabay.com/photo/2019/08/11/15/48/road-trip-4399206_1280.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2),
}));

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: "center",
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur
  
    const requestData = { email, password };
  
    try {
      // Envoyer une requête POST au serveur
      const response = await fetch(`${HOSTNAME_WEB}/profil/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indiquer que le corps de la requête est en JSON
        },
        body: JSON.stringify(requestData),
      });
  
      // Vérifier si la réponse est correcte
      if (!response.ok) {
        const errorData = await response.json(); // Lire les données d'erreur renvoyées par le serveur
        setErrorMessage(errorData.message || "Erreur : mot de passe ou utilisateur invalide");
        return;
      }
  
      // Lire les données de la réponse
      const responseData = await response.json();
       
      if(responseData){
        console.log(`user id is  : ${responseData.message}`)
        localStorage.setItem('userId', responseData.message);
        navigate("/admin");
      }
  
      // Redirection vers /admin si la connexion est réussie
  
    } catch (error) {
      console.error("Erreur lors de la tentative de connexion :", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };
  

  const handleForgotPassword = async (
    event: React.FormEvent
  ): Promise<void> => {
    event.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur

    const requestData = { email: forgotEmail };
    console.log("Forgot password data:", requestData);

    try {
      const response: ServerResponse = await fakeServerRequest(requestData);

      if (response.success) {
        alert("Un e-mail pour réinitialiser votre mot de passe a été envoyé.");
        setShowForgotPassword(false);
      } else {
        setErrorMessage(response.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du mot de passe :", error);
      setErrorMessage("Une erreur est survenue.");
    }
  };

  return (
    <LoginContainer>
      <LoginForm elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {showForgotPassword ? "Mot de passe oublié" : "Connexion"}
        </Typography>

        {!showForgotPassword ? (
          <form onSubmit={handleLogin}>
            <TextField
              label="Adresse e-mail"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mot de passe"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Se connecter
            </Button>
            <Box mt={2}>
              <Typography variant="body2">
                <Link
                  href="#"
                  onClick={() => setShowForgotPassword(true)}
                  underline="hover"
                >
                  Mot de passe oublié ?
                </Link>
              </Typography>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <TextField
              label="Adresse e-mail"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Réinitialiser le mot de passe
            </Button>
            <Box mt={2}>
              <Typography variant="body2">
                <Link
                  href="#"
                  onClick={() => setShowForgotPassword(false)}
                  underline="hover"
                >
                  Retour à la connexion
                </Link>
              </Typography>
            </Box>
          </form>
        )}
      </LoginForm>
    </LoginContainer>
  );
};

// Fonction simulant une requête serveur (remplacer par une requête API réelle)
const fakeServerRequest = async (data: {
  email: string;
  password?: string;
}): Promise<ServerResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.email === "test@example.com" && data.password === "password") {
        resolve({ success: true, user: { id: 1, name: "Utilisateur Test" } });
      } else if (data.email) {
        resolve({
          success: false,
          message: "Email ou mot de passe invalide.",
        });
      } else {
        resolve({ success: false, message: "Une erreur est survenue." });
      }
    }, 1000);
  });
};



export default Login;

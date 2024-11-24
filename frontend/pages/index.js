import { Container, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import Link from 'next/link'; 
import 'leaflet/dist/leaflet.css';


// Estilo para el contenedor de fondo
const BackgroundContainer = styled("div")(({ theme }) => ({
  position: "relative",
  height: "100vh",
  width: "100%",
  backgroundImage: `url('/images/fondo2.jpeg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Estilo para el contenedor del contenido
const ContentContainer = styled(Container)(({ theme }) => ({
  textAlign: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo blanco con opacidad para contraste
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const Home = () => {
  return (
    <BackgroundContainer>
      <ContentContainer maxWidth="sm">
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            color: "#E53935", // Color del texto (puedes usar cualquier color)
            textTransform: "uppercase", // Convertir el texto a mayúsculas
            fontWeight: "bold", // Hacer el texto en negrita
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Identifícate
        </Typography>
        <Box display="flex" justifyContent="center" spacing={2}>
          <Link href="/dashboard-inicio-e" passHref>
            <Button variant="contained" color="primary" sx={{
              backgroundColor: '#1E88E5', // Color del botón
              color: '#fff', // Color del texto del botón
              fontFamily: 'Roboto, sans-serif', // Aplicar fuente Roboto
              '&:hover': {
                backgroundColor: '#1565c0', // Color del botón al pasar el ratón
              },
              margin: 1,
            }}>
              Personal de emergencia
            </Button>
          </Link>
          <Link href="/dashboard-inicio-l" passHref>
            <Button variant="contained" color="secondary" sx={{
              backgroundColor: '#1E88E5', // Color del botón
              color: '#fff', // Color del texto del botón
              fontFamily: 'Roboto, sans-serif', // Aplicar fuente Roboto
              '&:hover': {
                backgroundColor: '#1565c0', // Color del botón al pasar el ratón
              },
              margin: 1,
            }}>
              Usuario Local
            </Button>
          </Link>
        </Box>
      </ContentContainer>
    </BackgroundContainer>
  );
};

export default Home;


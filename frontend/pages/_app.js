import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css'; // Importa estilos de Leaflet

// Define el tema de Material-UI
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Montserrat, Roboto, sans-serif',
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Tu descripción aquí" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.png"
        />
        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;

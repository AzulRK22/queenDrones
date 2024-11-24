import Head from 'next/head'; // Asegúrate de importar Head
import { ThemeProvider, createTheme } from '@mui/material/styles';
import 'leaflet/dist/leaflet.css';
import CssBaseline from '@mui/material/CssBaseline';


// Define el tema
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif, Roboto', // Configura la fuente global
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>

      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;

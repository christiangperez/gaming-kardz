import { Provider } from 'react-redux';

import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme
} from '@mui/material';

import { store } from './redux/store/store';
import { AppRouter } from './routers/AppRouter';
import './App.css';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d0f177',
      light: '#0209a1',
      dark: '#000338'
    },
    secondary: {
      main: '#192112',
      light: '#0fa9bd',
      dark: '#0a6b78'
    }
  },
  typography: {
    fontFamily: ['Urbanist', 'Roboto', 'sans-serif'].join(',')
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyles: 'none' } }}
        />
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <AppRouter />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;

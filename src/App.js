import { Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "./state/slices/theme";
import Header from "./components/Header";
import Favorites from "./components/Favorites";
import Home from "./components/Home";

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container
        sx={{
          marginTop: "64px",
          padding: "20px",
        }}
      >
        {/* <Home /> */}
        <Favorites />
      </Container>
    </ThemeProvider>
  );
}

export default App;

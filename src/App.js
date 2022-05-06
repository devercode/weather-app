import { Container, styled, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Favorites from "./components/Favorites";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Main = styled(Box)`
  height: calc(100vh - 64px);
`;

function App() {
  const themeMode = useSelector((state) => state.setting.mode);
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
      <Router>
        <Header />
        <Main
          sx={{
            bgcolor: "background.default",
          }}
        >
          <Container
            sx={{
              marginTop: "64px",
              padding: "20px",
            }}
          >
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Container>
        </Main>
      </Router>
    </ThemeProvider>
  );
}

export default App;

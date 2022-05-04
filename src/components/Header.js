import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { actions } from "../state/slices/theme";
const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const toggleTheme = () => {
    dispatch(actions.toggle());
  };
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h5">Herolo Weather App</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Stack spacing={5} direction={"row"} alignItems={"center"}>
            <Link href="/" underline={"none"} color="text.primary" variant="h5">
              Home
            </Link>
            <Link
              href="/favorites"
              underline={"none"}
              color="text.primary"
              variant="h5"
            >
              Favorites
            </Link>
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme}>
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            {/* <LinkRouter to="/">Home</LinkRouter>
            <LinkRouter to="/favorites">Favorites</LinkRouter> */}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

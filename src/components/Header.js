import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
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
          <ToggleButtonGroup value={"home"} color="primary">
            <ToggleButton value="home">Home</ToggleButton>
            <ToggleButton value="favorites">Favorites</ToggleButton>
          </ToggleButtonGroup>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme}>
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

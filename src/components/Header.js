import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { actions, TEMPERATURE } from "../state/slices/setting";
import { Link as RouterLink } from "react-router-dom";
const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(actions.toggleTheme());
  };

  const onTempModeChange = (e) => {
    dispatch(actions.setTempMode(e.target.value));
  };

  const tempMode = useSelector((state) => state.setting.temperature);

  return (
    <AppBar
      sx={{
        zIndex: 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6"> Weather App</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Stack spacing={5} direction={"row"} alignItems={"center"}>
            <Link
              component={RouterLink}
              to="/"
              underline={"none"}
              color="text.primary"
              variant="h5"
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/favorites"
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

            <ToggleButtonGroup
              value={tempMode}
              size="small"
              onChange={onTempModeChange}
              exclusive={true}
            >
              <ToggleButton
                value={TEMPERATURE.Celsius}
                key={TEMPERATURE.Celsius}
              >
                °C
              </ToggleButton>
              <ToggleButton
                value={TEMPERATURE.Fahrenheits}
                key={TEMPERATURE.Fahrenheits}
              >
                °F
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

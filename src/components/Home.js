import {
  Autocomplete,
  Box,
  TextField,
  Card,
  Stack,
  Typography,
  Alert,
  Grid,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import {
  getLocationByText,
  getForecast5dayByLocation,
  getLocationByGEO,
} from "../api";
import { useDebouncedCallback } from "use-debounce";
import _ from "lodash";
import ReactMoment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state/slices/favorites";
import { actions as homeActions } from "../state/slices/home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import TempFormatter from "./TempFormatter";
const SearchBox = ({ onSelect }) => {
  const [opts, setOpts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useDebouncedCallback((v) => {
    // use Debounce to prevent client does many requests to api
    getLocationByText(v)
      .then(({ data }) => {
        setOpts(
          _.uniqBy(
            data.map((record) => ({
              title: `${record.EnglishName}, ${record.Country.EnglishName}`,
              value: record.Key,
              ...record,
            })),
            "title"
          )
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  const onInputChange = (v) => {
    setLoading(true);
    fetch(v.target.value);
  };

  return (
    <Box>
      <Autocomplete
        getOptionLabel={(option) => option.title}
        options={opts}
        onChange={(_, v) => {
          onSelect(v);
        }}
        loading={loading}
        freeSolo={true}
        renderInput={(params) => (
          <TextField {...params} onChange={onInputChange} />
        )}
      />
    </Box>
  );
};
/**
 * The component used for detect GEO  and fetch location, when location is fetched it will fire the onReady function
 */
const DefaultLocation = ({ onReady }) => {
  const [geo, error] = useCurrentPosition();
  useEffect(() => {
    if (geo) {
      getLocationByGEO(geo.coords.latitude, geo.coords.longitude).then(
        ({ data: location }) => {
          onReady(location);
        }
      );
    }
    // eslint-disable-next-line
  }, [geo]);
  if (!geo && !error) {
    // show Loading button during waiting user accepts location permission
    return (
      <Box
        sx={{
          display: "flex",
        }}
        mt={4}
        justifyContent={"center"}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    //show  error when user doesn't accept location permission
    return (
      <Box
        sx={{
          display: "flex",
        }}
        mt={4}
        justifyContent={"center"}
      >
        f
        <Alert severity="error">
          Couldn't detect current location, please turn on location permission!.
        </Alert>
      </Box>
    );
  }

  return <></>;
};

/**
 * Show daily Forecast
 * input is forecast data
 */
const Forecast = (data) => {
  return (
    <Card
      sx={{
        minWidth: "150px",
        padding: "20px",
      }}
    >
      <Stack spacing={5}>
        <Typography variant="h5" textAlign={"center"}>
          <ReactMoment format="ddd">{data.Date}</ReactMoment>
        </Typography>
        <Typography variant="h6" textAlign={"center"}>
          <TempFormatter value={data.Temperature.Maximum.Value} />
        </Typography>
      </Stack>
    </Card>
  );
};

const Home = () => {
  const [data, setData] = useState(null);
  const currentLocation = useSelector((state) => state.home.currentLocation);

  const dispatch = useDispatch();

  const onSelect = (location) => {
    dispatch(homeActions.setCurrentLocation(location));
  };
  const favorites = useSelector((state) => state.favorites.locations);

  const isFavorite = useMemo(() => {
    if (!data || !data.location) return false;
    return _.find(favorites, {
      Key: data.location.Key,
    });
  }, [data, favorites]);

  const ToggleFavorite = useCallback(() => {
    if (isFavorite) {
      dispatch(actions.remove(data.location));
    } else {
      dispatch(actions.add(data.location));
    }
    // eslint-disable-next-line
  }, [isFavorite, data]);

  const onLocationReady = (location) => {
    dispatch(homeActions.setCurrentLocation(location));
  };
  useEffect(() => {
    if (currentLocation) {
      getForecast5dayByLocation(currentLocation).then((res) => {
        setData(res);
      });
    }
  }, [currentLocation]);

  return (
    <>
      <SearchBox onSelect={onSelect} />
      {/** If no location was set we use GEO location */}
      {!currentLocation && <DefaultLocation onReady={onLocationReady} />}{" "}
      {/** Show Location data when it was fetched */}
      {data && (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
            marginTop: "25px",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <div>
              <Typography
                variant="h2"
                sx={{
                  color: "text.primary",
                }}
              >
                {data.location.EnglishName}, {data.location.Country.EnglishName}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "text.primary",
                }}
              >
                <TempFormatter
                  value={data.DailyForecasts[0].Temperature.Maximum.Value}
                />
              </Typography>
            </div>
            <div>
              <IconButton onClick={ToggleFavorite}>
                {isFavorite ? (
                  <FavoriteIcon color={"secondary"} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </div>
          </Stack>

          <Typography
            variant="h3"
            textAlign={"center"}
            mt={10}
            mb={10}
            sx={{
              color: "text.primary",
            }}
          >
            {data.DailyForecasts[0].Day.ShortPhrase}
          </Typography>

          <Grid direction={"row"} spacing={4} flexWrap={"wrap"} container>
            {data.DailyForecasts.map((forecast, i) => (
              <Grid item>
                <Forecast {...forecast} key={i} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Home;

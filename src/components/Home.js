import {
  Autocomplete,
  Box,
  TextField,
  Card,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import {
  get5dayForeCastByGEO,
  getLocationByText,
  getForecast5dayByLocation,
} from "../api";
import { useDebouncedCallback } from "use-debounce";
import _ from "lodash";
import ReactMoment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state/slices/favorites";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
const SearchBox = ({ onSelect }) => {
  const [opts, setOpts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useDebouncedCallback((v) => {
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

const DefaultLocation = ({ onReady }) => {
  const [geo, error] = useCurrentPosition();

  useEffect(() => {
    if (geo) {
      get5dayForeCastByGEO(geo.coords.latitude, geo.coords.longitude).then(
        (data) => {
          onReady(data);
        }
      );
    }
  }, [geo, onReady]);
  if (!geo && !error) {
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
          {data.Temperature.Maximum.Value}° C
        </Typography>
      </Stack>
    </Card>
  );
};

const Home = () => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const onSelect = (location) => {
    getForecast5dayByLocation(location).then((res) => {
      setData(res);
    });
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
  }, [isFavorite]);

  const onLocationReady = (data) => {
    setData(data);
  };
  useEffect(() => {
    window.NProgress.start();
  }, []);

  return (
    <>
      <SearchBox onSelect={onSelect} />
      <DefaultLocation onReady={onLocationReady} />
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
              <Typography variant="h2">
                {data.location.EnglishName}, {data.location.Country.EnglishName}
              </Typography>
              <Typography variant="h4">
                {data.DailyForecasts[0].Temperature.Maximum.Value}° C
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

          <Typography variant="h3" textAlign={"center"} mt={10} mb={10}>
            {data.DailyForecasts[0].Day.ShortPhrase}
          </Typography>

          <Stack
            direction={"row"}
            spacing={4}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            {data.DailyForecasts.map((forecast, i) => (
              <Forecast {...forecast} key={i} />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Home;

import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import {
  get5dayForeCastByGEO,
  getLocationByText,
  getForecastByLocation,
} from "../api";
import { useDebouncedCallback } from "use-debounce";
import _ from "lodash";
import response from "./response.json";
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
    getLocationByText(v).then(({ data }) => {
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
        onChange={onSelect}
        getOptionLabel={(option) => option.title}
        options={opts}
        onChange={(event, value) => {
          onSelect(value);
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

const DefaultLocation = React.memo(() => {
  const [geo, error] = useCurrentPosition();

  useEffect(() => {
    if (geo) {
      get5dayForeCastByGEO(geo.coords.latitude, geo.coords.longitude).then(
        (data) => {
          console.log(data);
        }
      );
    }
  }, [geo]);
  if (!geo && !error) {
    return <div>Loading</div>;
  }
  if (error) {
    return (
      <div>
        Couldn't detect current Location. Please Allow Location permission
      </div>
    );
  }

  return (
    <div>
      {geo.coords.latitude} {geo.coords.longitude}
    </div>
  );
});

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
  const [data, setData] = useState(response);
  const { DailyForecasts, Headline, location } = data;
  const dispatch = useDispatch();
  const onSelect = (v) => {
    getForecastByLocation(v).then((res) => {
      setData(res);
    });
  };
  const favorites = useSelector((state) => state.favorites.locations);
  const isFavorite = useMemo(() => {
    return _.find(favorites, {
      Key: location.Key,
    });
  }, [location, favorites]);

  const Saved = () => {
    dispatch(actions.add(location));
  };
  return (
    <>
      <SearchBox onSelect={onSelect} />
      {/* <DefaultLocation /> */}
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
              {location.EnglishName}, {location.Country.EnglishName}
            </Typography>
            <Typography variant="h4">
              {DailyForecasts[0].Temperature.Maximum.Value}° C
            </Typography>
          </div>
          <div>
            <IconButton onClick={Saved}>
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
        </Stack>

        <Typography variant="h3" textAlign={"center"} mt={10} mb={10}>
          {DailyForecasts[0].Day.ShortPhrase}
        </Typography>

        <Stack
          direction={"row"}
          spacing={4}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          {DailyForecasts.map((forecast) => (
            <Forecast {...forecast} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Home;

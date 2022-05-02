import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import { get5dayForeCastByGEO } from "../api";
import response from "./response.json";
import ReactMoment from "react-moment";

const SearchBox = () => {
  const [opts, setOpts] = useState([]);
  return (
    <Box>
      <Autocomplete
        options={opts}
        freeSolo={true}
        renderInput={(params) => <TextField {...params} />}
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
      style={{
        textAlign: "center",
      }}
    >
      <ReactMoment format="ddd">{data.Date}</ReactMoment>
      <p>{data.Temperature.Maximum.Value}° C</p>
    </Card>
  );
};
const Home = () => {
  const [data, setData] = useState(response);
  const { DailyForecasts, Headline, location } = data;
  return (
    <>
      <SearchBox />
      {/* <DefaultLocation /> */}
      <Box>
        <div>
          <div>
            <p>{location.EnglishName}</p>
            <p>{DailyForecasts[0].Temperature.Maximum.Value}° C</p>
          </div>
        </div>
        <div>
          <Button>Favorites</Button>
        </div>
        <div>{DailyForecasts[0].Day.ShortPhrase}</div>
        <Stack direction={"row"} spacing={10} justifyContent={"center"}>
          {DailyForecasts.map((forecast) => (
            <Forecast {...forecast} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Home;

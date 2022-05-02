import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import { get5dayForeCastByGEO } from "../api";

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

const Home = () => {
  return (
    <>
      <SearchBox />
      <DefaultLocation />
    </>
  );
};

export default Home;

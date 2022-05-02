import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import { searchByGEO } from "../api";

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
      searchByGEO(geo.coords.latitude, geo.coords.longitude);
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

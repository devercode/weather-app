import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getForecast1DayByLocation } from "../api";
import { Card, Typography, Stack, Grid } from "@mui/material";
const Location = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    getForecast1DayByLocation(props).then((data) => setData(data));
  }, []);

  return (
    <Card
      sx={{
        minWidth: "150px",
        padding: "20px",
      }}
    >
      {data && (
        <Stack spacing={3}>
          <Typography variant="h5" textAlign={"center"}>
            {data.location.EnglishName}, {data.location.Country.EnglishName}
          </Typography>
          <Typography variant="h6" textAlign={"center"}>
            {data && data.DailyForecasts[0].Temperature.Maximum.Value}° C
          </Typography>
          <Typography textAlign={"center"}>
            {data.DailyForecasts[0].Day.ShortPhrase}
          </Typography>
        </Stack>
      )}
    </Card>
  );
};
const Favorites = () => {
  const favLocations = useSelector((state) => state.favorites.locations);

  return (
    <Grid spacing={10} direction={"row"} flexWrap={"wrap"} container>
      {favLocations.map((fav, i) => (
        <Grid item key={i}>
          <Location {...fav} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Favorites;

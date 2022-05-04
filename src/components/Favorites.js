import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getForecast1DayByLocation } from "../api";
import { Card, Typography, Stack } from "@mui/material";
const Location = (props) => {
  const [data, setData] = useState(null);
  console.log(data);
  useEffect(() => {
    getForecast1DayByLocation(props).then((data) => setData(data));
  }, []);

  return (
    <Card>
      {data && (
        <Typography>
          {data.location.EnglishName}, {data.location.Country.EnglishName}
        </Typography>
      )}
      {data && (
        <Typography>
          {data && data.DailyForecasts[0].Temperature.Maximum.Value}° C
        </Typography>
      )}
      {data && (
        <Typography>{data.DailyForecasts[0].Day.ShortPhrase}</Typography>
      )}
    </Card>
  );
};
const Favorites = () => {
  const favLocations = useSelector((state) => state.favorites.locations);
  console.log(favLocations);
  return (
    <Stack spacing={10}>
      {favLocations.map((fav) => (
        <Location {...fav} />
      ))}
    </Stack>
  );
};

export default Favorites;

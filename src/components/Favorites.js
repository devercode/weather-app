import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForecast1DayByLocation } from "../api";
import { Card, Typography, Stack, Grid } from "@mui/material";
import { actions as homeActions } from "../state/slices/home";
import TempFormatter from "./TempFormatter";
import { useNavigate } from "react-router-dom";

const Location = (location) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const onSelect = () => {
    dispatch(homeActions.setCurrentLocation(location));
    navigate("/");
  };
  useEffect(() => {
    getForecast1DayByLocation(location).then((data) => setData(data));
    // eslint-disable-next-line
  }, []);

  return (
    <Card
      onClick={onSelect}
      sx={{
        minWidth: "150px",
        padding: "20px",
      }}
    >
      {/** Show data when  ready */}
      {data && (
        <Stack spacing={3}>
          <Typography variant="h5" textAlign={"center"}>
            {data.location.EnglishName}, {data.location.Country.EnglishName}
          </Typography>
          <Typography variant="h6" textAlign={"center"}>
            <TempFormatter
              value={data.DailyForecasts[0].Temperature.Maximum.Value}
            />
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
  const favLocations = useSelector((state) => state.favorites.locations); // list of favorited locations

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

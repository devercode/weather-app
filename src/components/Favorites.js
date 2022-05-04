import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getForecast1DayByLocation } from "../api";

const Location = (props) => {
  const [data, setData] = useState(null);
  console.log(data);
  useEffect(() => {
    getForecast1DayByLocation(props).then((data) => setData(data));
  }, []);
  return <div>{props.Key}</div>;
};
const Favorites = () => {
  const favLocations = useSelector((state) => state.favorites.locations);
  console.log(favLocations);
  return (
    <div>
      {favLocations.map((fav) => (
        <Location {...fav} />
      ))}
    </div>
  );
};

export default Favorites;

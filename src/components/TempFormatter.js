import { useSelector } from "react-redux";
import { TEMPERATURE } from "../state/slices/setting";
import { toFahrenheit } from "celsius";

const TempFormatter = ({ value }) => {
  const tempMode = useSelector((state) => state.setting.temperature);
  return (
    <>
      {tempMode === TEMPERATURE.Celsius
        ? `${value} °C`
        : `${toFahrenheit(value, 1)} °F`}
    </>
  );
};

export default TempFormatter;

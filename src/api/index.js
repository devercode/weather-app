import axios from "axios";

const client = axios.create({
  baseURL: "https://dataservice.accuweather.com",
  params: {
    apikey: "myFAXbBmLQPh5NSD1TD549oTce5Ck2uC",
  },
});

export const getLocationByGEO = (lat, lon) => {
  return client.get("/locations/v1/cities/geoposition/search", {
    params: {
      q: `${lat}, ${lon}`,
    },
  });
};

export const getLocationByText = (search) => {
  console.log(search);
  return client.get("/locations/v1/cities/search", {
    params: {
      q: search,
    },
  });
};
export const getForecastByLocation = async (location) => {
  const { data } = await client.get(
    `/forecasts/v1/daily/5day/${location.Key}`,
    {
      params: {
        details: true,
        metric: true,
      },
    }
  );
  return {
    ...data,
    location,
  };
};

export const getForecast1DayByLocation = async (location) => {
  const { data } = await client.get(
    `/forecasts/v1/daily/1day/${location.Key}`,
    {
      params: {
        details: true,
        metric: true,
      },
    }
  );
  return {
    ...data,
    location,
  };
};

export const get5dayForeCastByGEO = async (lat, lon) => {
  const { data } = await getLocationByGEO(lat, lon);

  const dt = await getForecastByLocation(data.Key);

  console.log(JSON.stringify(dt));

  return dt;
};

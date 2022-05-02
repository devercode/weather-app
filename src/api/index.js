import axios from "axios";

const client = axios.create({
  baseURL: "https://dataservice.accuweather.com",
  params: {
    apikey: "mrIhUufHhwBrTsQLotj4tOW5jO7ku6LQ",
  },
});

export const getLocationByGEO = (lat, lon) => {
  return client.get("/locations/v1/cities/geoposition/search", {
    params: {
      q: `${lat}, ${lon}`,
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

export const get5dayForeCastByGEO = async (lat, lon) => {
  const { data } = await getLocationByGEO(lat, lon);
  return await getForecastByLocation(data);
};

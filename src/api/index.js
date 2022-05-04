import axios from "axios";
import _ from "lodash";
const keys = [
  "sqAsoOUJlZgRBCkyfEBrl23jnntaOfuw",
  "dtsHeugV48INzXPkjfG1ENV74Bb4NGMx",
  "gvwLIfThiOTtzFNzl2WwPRkKuXA5tTQi",
  "XVb86zFjDIsFU0yrnZAHepOPM51bs3k9",
  "cGeBZKrzq1FEJzquy1cyYQfGso5JEDdT",
  "KgzxgUieAeJSsnuN2GO10mIjsk8vbRho",
  "Oe3WMvOtZ0laAZg5pSCtQIqxiOOa7Jbe",
  "pnJvjBIq0gP2NU0le41HfuPZGp3kPfSL",
  "eaGlYlLqRY0JRcsq0foLZGsu3aVZshxk",
  "TkEDMtKAGzT7ruveBl6rR2JKGIaTjUqK",
  "TothQJZ14f0G1sKaf7oIAixGXQnjenaN",
];

const client = axios.create({
  baseURL: "https://dataservice.accuweather.com",
  params: {
    apikey: "myFAXbBmLQPh5NSD1TD549oTce5Ck2uC",
  },
});

client.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    apikey: _.shuffle(keys)[0],
  };
  return request;
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

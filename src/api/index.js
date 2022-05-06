import axios from "axios";
import _ from "lodash";
import { toast } from "react-toastify";

const keys = [
  // list of api keys
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
  "myFAXbBmLQPh5NSD1TD549oTce5Ck2uC",
];

const client = axios.create({
  baseURL: "https://dataservice.accuweather.com",
  params: {
    apikey: "",
  },
});

client.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    apikey: _.shuffle(keys)[0], // change the API key before send request
  };
  window.NProgress.start();
  return request;
});

client.interceptors.response.use(
  function (response) {
    window.NProgress.done();
    return response;
  },
  function (err) {
    window.NProgress.done();
    if (err.code === "ERR_NETWORK") {
      // detect the API Limit and show toast message
      toast.error("Reached API Limit");
    } else {
      toast.error(err.response.data); // show api error message
    }
    return Promise.reject(err);
  }
);

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
export const getForecast5dayByLocation = async (location) => {
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
  const { data: location } = await getLocationByGEO(lat, lon);
  return await getForecast5dayByLocation(location);
};

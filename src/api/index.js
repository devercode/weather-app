import axios from "axios";

const client = axios.create({
  baseURL: "http://dataservice.accuweather.com",
  params: {
    apiKey: "mrIhUufHhwBrTsQLotj4tOW5jO7ku6LQ",
  },
});

export const searchByGEO = (lat, lon) => {
  return client.get("locations/v1/cities/geoposition/search", {
    params: {
      details: true,
      q: `${lat}, ${lon}`,
    },
  });
};

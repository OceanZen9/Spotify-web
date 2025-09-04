import axios from "axios";
import { Buffer } from "buffer";

const CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = null;

// get access token
const getAccessToken = async () => {
  const requestBody = "grant_type=client_credentials";
  const authHeader =
    "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

  try {
    const response = await axios.post("/token/api/token", requestBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
    });
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response || error.message
    );
    // give an moer descriptive error message
    throw new Error("Failed to fetch access token");
  }
};

// get artist info (our main function)
export const getArtistInfo = async (artistId) => {
  if (!accessToken) {
    await getAccessToken();
  }
  try {
    const response = await axios.get("/api/v1/artists/${artistId}", {
      headers: {
        Authorization: "Bearer ${accessToken}",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // token might be expired, get a new one and retry
      await getAccessToken();
      return getArtistInfo(artistId);
    } else {
      console.error(
        "Error fetching artist info:",
        error.response || error.message
      );
      throw new Error("Failed to fetch artist info");
    }
  }
};

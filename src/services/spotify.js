const clientId = process.env.VUE_APP_CLIENT_ID; // Replace with client ID
const redirectUri = "http://127.0.0.1:8080/callback"; // Replace with redirect URI
console.log("即将发送给Spotify的Client ID是:", clientId);

/*
In this function, a new URLSearchParams object is created, and we add the client_id, response_type, redirect_uri and scope parameters to it. 
The scope parameter is a list of permissions that we're requesting from the user. In this case, we're requesting the user-read-private 
and user-read-email scopes - these are the scopes that allow us to fetch the user's profile data.
The redirect_uri parameter is the URL that Spotify will redirect the user back to after they've authorized the application. 
In this case, we're using a URL that points to our local Vite dev server.
*/
export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 *
 * @param {string} code Authorization code obtained from the URL
 * @returns {Promise<string>} access token
 */
export async function getAccessToken(code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}
/**
 *
 * @param {string} token
 * @returns {Promise<Object>} profile information
 */
export async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!result.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await result.json();
}

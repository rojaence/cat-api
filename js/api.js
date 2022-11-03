const API_URL = "https://api.thecatapi.com/v1";
const API_KEY =
  "live_lKsKA11EDjMV9bWOWamMEjtJItkvbba4Rq573imu0QiwSpiwLCd6xAWT7Vmzsikm";

const getRandom = async () => {
  let paramsObj = { limit: 3 };
  let searchParams = new URLSearchParams(paramsObj);
  const response = await fetch(`${API_URL}/images/search?${searchParams}`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  return data;
};

const getFavourites = async () => {
  const response = await fetch(`${API_URL}/favourites`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  return data;
};

const getUploaded = async () => {
  const response = await fetch(`${API_URL}/images`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  return data;
};

const saveFavourite = async (imageId) => {
  const postData = { image_id: imageId };
  const response = await fetch(`${API_URL}/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(postData),
  });
  const data = await response.json();
  return data;
};

const removeFavourite = async (id) => {
  const response = await fetch(`${API_URL}/favourites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  return data;
};

const uploadFile = async (file) => {
  const response = await fetch(`${API_URL}/images/upload`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
    },
    body: file,
  });
  const data = await response.json();
  return data;
};

export {
  getRandom,
  getFavourites,
  getUploaded,
  saveFavourite,
  removeFavourite,
  uploadFile,
};

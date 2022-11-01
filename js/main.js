const API_URL = "https://api.thecatapi.com/v1";
const API_KEY =
  "live_lKsKA11EDjMV9bWOWamMEjtJItkvbba4Rq573imu0QiwSpiwLCd6xAWT7Vmzsikm";
const getButton = document.getElementById("get-button");
const randomSection = document.querySelector("#random-cards");
const favouriteSection = document.querySelector("#favorite-cards");
const cardTemplate = document.querySelector("#item-card");
const noFavoriteData = document.createElement("SPAN");

// Modal initialization
const appModal = new bootstrap.Modal("#appModal");
let favourites = [];

// Toast initialization
const toastEl = document.getElementById('app-toast');
const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

getButton.addEventListener("click", async () => {
  await getRandomImages("beng");
  await getFavourites();
});

const getRandomImages = async (breed) => {
  try {
    getButton.setAttribute("disabled", true);
    let paramsObj = { limit: 3 };
    let searchParams = new URLSearchParams(paramsObj);
    const response = await fetch(`${API_URL}/images/search?${searchParams}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const data = await response.json();
    getButton.removeAttribute("disabled");
    setRandomCards(data);
  } catch (error) {
    showAlert({
      title: 'An error has occurred',
      message: error.message,
      success: false,
    });
    console.log("🚀 ~ file: main.js ~ line 10 ~ getImageUrl ~ error", error);
  }
};

const getFavourites = async () => {
  try {
    const response = await fetch(`${API_URL}/favourites`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const data = await response.json();
    favourites = data;
    setFavoriteCards(data);
  } catch (error) {
    showAlert({
      title: 'An error has occurred',
      message: error.message,
      success: false,
    });
    console.log("🚀 ~ file: main.js ~ line 10 ~ getImageUrl ~ error", error);
  }
};

const setRandomCards = (data) => {
  randomSection.textContent = "";
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector("#cat-picture").src = item.url;
    card.querySelector(".card__action").classList.add("btn-success");
    card.querySelector(".btn__text").textContent = "Add to favourites";
    card
      .querySelector(".card__action")
      .querySelector("i")
      .classList.add("bi-bookmark-heart");
    card.querySelector(".card__action").addEventListener("click", () => {
      saveFavourite(item.id).then;
    });
    fragment.appendChild(card);
  });
  randomSection.appendChild(fragment);
};

const showToast = (message) => {
  toast['_element'].querySelector('.toast-body').textContent = message;
  toast.show();
};

const showAlert = ({ title, message, success }) => {
  appModal["_element"].querySelector("#app-modal-title").textContent =
    title;
  appModal["_element"].querySelector("#app-modal-message").textContent =
    message;
  if (success) {
    appModal["_element"].querySelector("#app-modal-icon").className =
      "bi bi-check-circle";
    appModal["_element"].querySelector("#app-modal-icon").style.color =
      "var(--bs-green)";
  } else {
    appModal["_element"].querySelector("#app-modal-icon").className =
      "bi bi-x-circle";
    appModal["_element"].querySelector("#app-modal-icon").style.color =
      "var(--bs-red)";
  }
  appModal.show();
};

const setFavoriteCards = (data) => {
  favouriteSection.textContent = "";
  let fragment = document.createDocumentFragment();
  if (data.length === 0) {
    noFavoriteData.className = "col text-center p-4";
    noFavoriteData.textContent = "No favourites";
    favouriteSection.appendChild(noFavoriteData);
    return;
  }
  data.forEach((item) => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector("#cat-picture").src = item.image.url;
    card.querySelector(".card__action").classList.add("btn-danger");
    card.querySelector(".btn__text").textContent = "Remove from favourites";
    card
      .querySelector(".card__action")
      .querySelector("i")
      .classList.add("bi-bookmark-x");
    card.querySelector('.card__action').addEventListener('click', () => removeFavourite(item.id));
    fragment.appendChild(card);
  });
  favouriteSection.appendChild(fragment);
};

const saveFavourite = async (imageId) => {
  const postData = { image_id: imageId };
  try {
    if (favourites.some(item => item.image.id === imageId)) {
      showAlert({
        title: 'Favourites',
        message: 'This image already exists in favourites',
        success: true,
      });
    } else {
      const response = await fetch(`${API_URL}/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(postData),
      });
      const resData = await response.json();
      if (resData.message == 'SUCCESS') showToast('Favourite saved');
      await getFavourites();
    }
  } catch (error) {
    showAlert({
      title: 'An error has occurred',
      message: error.message,
      success: false,
    });
    console.log(error);
  }
};

const removeFavourite = async (id) => {
  try {
    const response = await fetch(`${API_URL}/favourites/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      }
    });
    const resData = await response.json();
    if (resData.message == 'SUCCESS') showToast('Favourite removed!');
    await getFavourites();
  } catch(error) {
    showAlert({
      title: 'Failed to remove favourite',
      message: error.message,
      success: false,
    });
  }
};

window.addEventListener("load", async () => {
  await getRandomImages("beng");
  await getFavourites();
});
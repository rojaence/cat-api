const API_URL = "https://api.thecatapi.com/v1";
const API_KEY =
  "live_lKsKA11EDjMV9bWOWamMEjtJItkvbba4Rq573imu0QiwSpiwLCd6xAWT7Vmzsikm";
const getButton = document.getElementById("get-button");
const randomSection = document.querySelector("#random-cards");
const favouriteSection = document.querySelector("#favorite-cards");
const cardTemplate = document.querySelector("#item-card");
const noFavoriteData = document.createElement("SPAN");

const appModal = new bootstrap.Modal("#appModal");

getButton.addEventListener("click", async () => {
  await getRandomImages("beng");
  await getfavourites();
});

const getRandomImages = async (breed) => {
  try {
    getButton.setAttribute("disabled", true);
    let paramsObj = { limit: 3, api_key: API_KEY };
    let searchParams = new URLSearchParams(paramsObj);
    const response = await fetch(`${API_URL}/images/search?${searchParams}`);
    const data = await response.json();
    getButton.removeAttribute("disabled");
    setRandomCards(data);
  } catch (error) {
    showAlert(error, false);
    console.log("🚀 ~ file: main.js ~ line 10 ~ getImageUrl ~ error", error);
  }
};

const getfavourites = async () => {
  try {
    let paramsObj = { limit: 3, api_key: API_KEY };
    let searchParams = new URLSearchParams(paramsObj);
    const response = await fetch(`${API_URL}/favourites?${searchParams}`);
    const data = await response.json();
    setFavoriteCards(data);
  } catch (error) {
    showAlert(error, false);
    console.log("🚀 ~ file: main.js ~ line 10 ~ getImageUrl ~ error", error);
  }
};

const setRandomCards = (data) => {
  randomSection.textContent = "";
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector("#cat-picture").src = item.url;
    card.querySelector("#action-btn").classList.add("btn-success");
    card.querySelector(".btn__text").textContent = "Add to favourites";
    card
      .querySelector("#action-btn")
      .querySelector("i")
      .classList.add("bi-bookmark-heart");
    fragment.appendChild(card);
  });
  randomSection.appendChild(fragment);
};

const showAlert = (message, success) => {
  if (success) {
    appModal["_element"].querySelector("#app-modal-title").textContent =
      "Success";
    appModal["_element"].querySelector("#app-modal-message").textContent =
      message;
    appModal["_element"].querySelector("#app-modal-icon").className =
      "bi bi-check-circle";
    appModal["_element"].querySelector("#app-modal-icon").style.color =
      "var(--bs-green)";
  } else {
    appModal["_element"].querySelector("#app-modal-title").textContent =
      "An error has occurred";
    appModal["_element"].querySelector("#app-modal-message").textContent =
      message;
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
    card.querySelector("#cat-picture").src = item.url;
    card.querySelector("#action-btn").classList.add("btn-danger");
    card.querySelector(".btn__text").textContent = "Remove from favourites";
    card
      .querySelector("#action-btn")
      .querySelector("i")
      .classList.add("bi-bookmark-x");
    fragment.appendChild(card);
  });
  favouriteSection.appendChild(fragment);
};

window.addEventListener("load", async () => {
  await getRandomImages("beng");
  await getfavourites();
});

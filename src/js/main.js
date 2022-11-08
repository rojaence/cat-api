import * as bootstrap from "bootstrap";
import Viewer from "viewerjs";
import 'viewerjs/dist/viewer.css';
const imageIcon = new URL('../assets/imageIcon.svg', import.meta.url);
const saveTasks = [];
const removeTasks = [];

import {
  getRandom,
  getFavourites,
  saveFavourite,
  removeFavourite,
  uploadFile,
} from "./api.js";
const getButton = document.getElementById("get-button");
const randomSection = document.querySelector("#random-cards");
const favouriteSection = document.querySelector("#favorite-cards");
const cardTemplate = document.querySelector("#item-card");
const noFavoriteData = document.createElement("SPAN");
const uploadButton = document.getElementById("upload-button");
const form = document.getElementById("upload-form");
const imageInput = document.getElementById('image-file');
const imagePreview = document.getElementById('upload-preview');
const refreshFavouriteBtn = document.getElementById('refresh-favourites');

// Modal initialization
const appModal = new bootstrap.Modal("#appModal");
let favourites = [];

const uploadModalEl = document.getElementById("uploadModal");
const uploadModal = new bootstrap.Modal("#uploadModal");
const loadingModal = new bootstrap.Modal("#loadingModal");

// Toast initialization
const toastEl = document.getElementById("app-toast");
const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

// Viewer js initialziation
let randomGallery, favouriteGallery, previewViewer;

getButton.addEventListener("click", async () => {
  await getRandomImages();
});

uploadButton.addEventListener("click", () => {
  uploadModal.show();
});

refreshFavouriteBtn.addEventListener('click', async () => {
  await getFavouriteImages();
}); 

imageInput.addEventListener('change', (e) => {
  if (e.target.files[0] && e.target.files[0].type.includes('image')) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (e) => {
      imagePreview.setAttribute('src', e.target.result);
      setPreviewViewer(true);
    });
  } else {
    imagePreview.setAttribute('src', imageIcon);
    setPreviewViewer(false);
  }
});

uploadModal["_element"]
  .querySelector("#submit-image")
  .addEventListener("click", () => {
    uploadImage();
  });

uploadModalEl.addEventListener("hidden.bs.modal", (e) => {
  form.reset();
  imagePreview.setAttribute('src', imageIcon);
  setPreviewViewer(false);
});

const setRandomGallery = () => {
  if (randomGallery) randomGallery.destroy();
  randomGallery = new Viewer(randomSection);
};

const setFavouriteGallery = () => {
  if (favouriteGallery) favouriteGallery.destroy();
  favouriteGallery = new Viewer(favouriteSection);
};

const setPreviewViewer = (selected) => {
  if (previewViewer) previewViewer.destroy();
  if (selected) previewViewer = new Viewer(uploadModalEl);
};

const getRandomImages = async () => {
  try {
    getButton.setAttribute("disabled", true);
    const data = await getRandom();
    setRandomCards(data);
    setRandomGallery();
  } catch (error) {
    showAlert({
      title: "An error has occurred",
      message: error.message,
      success: false,
    });
  } finally {
    getButton.removeAttribute("disabled");
  }
};

const getFavouriteImages = async () => {
  try {
    refreshFavouriteBtn.setAttribute('disabled', true);
    const data = await getFavourites();
    favourites = data;
    setFavoriteCards(data);
    setFavouriteGallery();
  } catch (error) {
    showAlert({
      title: "An error has occurred",
      message: error.message,
      success: false,
    });
  } finally {
    refreshFavouriteBtn.removeAttribute("disabled");
  }
};

const showToast = (message) => {
  toast["_element"].querySelector(".toast-body").textContent = message;
  toast.show();
};

const showAlert = ({ title, message, success }) => {
  appModal["_element"].querySelector("#app-modal-title").textContent = title;
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
const setRandomCards = (data) => {
  randomSection.textContent = "";
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector(".card__image").src = item.url;
    card.querySelector(".card__action").classList.add("btn-success");
    card.querySelector(".card__action").setAttribute('title', 'Add to favourites');
    card
      .querySelector(".card__action")
      .querySelector("i")
      .classList.add("bi-heart");
    card.querySelector(".card__action").addEventListener("click", () => {
      saveFavouriteImage(item.id);
    });
    fragment.appendChild(card);
  });
  randomSection.appendChild(fragment);
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
    card.querySelector(".card__image").src = item.image.url;
    card.querySelector(".card__action").classList.add("btn-danger");
    card.querySelector(".card__action").setAttribute('title', 'Remove from favourites');
    card
      .querySelector(".card__action")
      .querySelector("i")
      .classList.add("bi-x-lg");
    card
      .querySelector(".card__action")
      .addEventListener("click", () => removeFavouriteImage(item.id));
    fragment.appendChild(card);
  });
  favouriteSection.appendChild(fragment);
};

const saveFavouriteImage = async (imageId) => {
  if (saveTasks.includes(imageId)) return;
  try {
    if (favourites.some((item) => item.image.id === imageId)) {
      showAlert({
        title: "Favourites",
        message: "This image already exists in favourites",
        success: true,
      });
    } else {
      saveTasks.push(imageId);
      const resData = await saveFavourite(imageId);
      if (resData.message == "SUCCESS") showToast("Favourite saved");
      await getFavouriteImages();
      let index = saveTasks.indexOf(imageId);
      saveTasks.splice(index, 1);
    }
  } catch (error) {
    showAlert({
      title: "An error has occurred",
      message: error.message,
      success: false,
    });
    console.log(error);
  }
};

const removeFavouriteImage = async (id) => {
  if (removeTasks.includes(id)) return;
  try {
    removeTasks.push(id);
    const resData = await removeFavourite(id);
    if (resData.message == "SUCCESS") showToast("Favourite removed!");
    await getFavouriteImages();
    let index = removeTasks.indexOf(id);
    removeTasks.splice(index, 1);
  } catch (error) {
    showAlert({
      title: "Failed to remove favourite",
      message: error.message,
      success: false,
    });
  }
};

const uploadImage = async () => {
  try {
    const formData = new FormData(form);
    if (
      formData.get("file").size === 0 ||
      !formData.get("file").type.includes("image")
    ) {
      return;
    }
    uploadModal.hide();
    loadingModal.show();
    const resData = await uploadFile(formData);
    await saveFavourite(resData.id);
    await getFavouriteImages();
    loadingModal.hide();
    showToast('Image saved successfully');
  } catch (error) {
    showAlert({
      title: "Failed to upload image",
      message: error.message,
      success: false,
    });
  } finally {
    loadingModal.hide();
  }
};

window.addEventListener("load", async () => {
  await getRandomImages();
  await getFavouriteImages();
});

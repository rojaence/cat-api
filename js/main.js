const API_URL = "https://api.thecatapi.com/v1/images/search";
const API_KEY = "live_lKsKA11EDjMV9bWOWamMEjtJItkvbba4Rq573imu0QiwSpiwLCd6xAWT7Vmzsikm";
const getButton = document.getElementById('get-button');
const randomSection = document.querySelector('#random-cards');
const favoriteSection = document.querySelector('#favorite-cards');
const cardTemplate = document.querySelector('#item-card');

getButton.addEventListener('click', () => {
  getRandomImages('beng');
});

const getRandomImages = async (breed) => {
  try {
    getButton.setAttribute('disabled', true);
    const response = await fetch(`${API_URL}?$breed_ids=${breed}&limit=3&api_key=live_lKsKA11EDjMV9bWOWamMEjtJItkvbba4Rq573imu0QiwSpiwLCd6xAWT7Vmzsikm`);
    const data = await response.json();
    getButton.removeAttribute('disabled');
    setRandomCards(data);
    setFavoriteCards(data);
  } catch(error) {
    console.log("🚀 ~ file: main.js ~ line 10 ~ getImageUrl ~ error", error)
    alert('Ha ocurrido un error mientras se cargaba la imagen');
  } finally {
    
  }
};

const setRandomCards = (data) => {
  randomSection.textContent = '';
  let fragment = document.createDocumentFragment();
  data.forEach(item => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector('#cat-picture').src = item.url;
    card.querySelector('#action-btn').classList.add('btn-success');
    card.querySelector('.btn__text').textContent = 'Add to favorites';
    card.querySelector('#action-btn').querySelector('i').classList.add('bi-bookmark-heart');
    fragment.appendChild(card);
  });
  randomSection.appendChild(fragment);
};

const setFavoriteCards = (data) => {
  favoriteSection.textContent = '';
  let fragment = document.createDocumentFragment();
  data.forEach(item => {
    let card = cardTemplate.content.cloneNode(true);
    card.querySelector('#cat-picture').src = item.url;
    card.querySelector('#action-btn').classList.add('btn-danger');
    card.querySelector('.btn__text').textContent = 'Remove from favorites';
    card.querySelector('#action-btn').querySelector('i').classList.add('bi-bookmark-x');
    fragment.appendChild(card);
  });
  favoriteSection.appendChild(fragment);
};


window.addEventListener('load', () => {
  getRandomImages('beng');
});
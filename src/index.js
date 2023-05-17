import SearchService from './SearchService.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import Notiflix from 'notiflix';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const searchService = new SearchService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.news.value.trim();
 

  if (value === '') throw Notiflix.Notify.info(
    "Request not completed"
  );
  else {
    searchService.q = value;
    searchService.resetPage();

    loadMoreBtn.show();
    clearNewsList();
    fetchArticles().finally(() => form.reset());
  }
}

function fetchArticles() {
  loadMoreBtn.disable();

  return getArticlesMarkup().then(() => loadMoreBtn.enable());
}

function getArticlesMarkup() {
  return searchService
    .getNews()
    .then(hits => {
      if (!hits) {
        loadMoreBtn.hide();
        return '';
      }
      if (hits.length === 0) throw new Error('No data');

      return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
    })
    .then(updateNewsList)
    .catch(onError);
}

function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`;
}

function updateNewsList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  Notiflix.Notify.info(
    "Sorry, there are no images matching your search query. Please try again."
  );
}

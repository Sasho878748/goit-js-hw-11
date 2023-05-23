import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SearchService from './js/SearchService.js';
import LoadMoreBtn from './js/LoadMoreBtn.js';

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

async function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.news.value.trim();

  if (value === '') {
    Notiflix.Notify.failure('Request not completed');
    return;
  }
  try {
    searchService.q = value;
    searchService.resetPage();

    loadMoreBtn.show();
    clearNewsList();
    const totalHits = await fetchArticles();

    form.reset();

    if (totalHits > 0) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchArticles() {
  loadMoreBtn.disable();
  const perPage = 40;
  const totalPage = 500 / perPage;

  try {
    const totalHits = await getArticlesMarkup();
    return totalHits;
  } catch (error) {
    console.error(error);
  } finally {
    if (
      searchService.page >= totalPage ||
      searchService.photoBeenDownload < perPage
    ) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.enable();
    }
  }
}

async function getArticlesMarkup() {
  try {
    const response = await searchService.getNews();

    if (!response.hits) {
      loadMoreBtn.hide();
      return '';
    }

    if (response.hits.length === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return '';
    }

    const { hits, totalHits } = response;

    const markup = hits.reduce((markup, hit) => markup + createMarkup(hit), '');
    await updateNewsList(markup);

    return totalHits;
  } catch (error) {
    console.error(error);
    onError(error);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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

async function updateNewsList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearNewsList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionsDelay: 250,
});

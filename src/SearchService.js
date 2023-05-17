const URL = 'https://pixabay.com/api/';
const API_KEY = '36471035-8dd0fed22317ca26f46d35a21';

export default class SearchService {
  constructor() {
    this.page = 1;
    this.q = '';
  }

  getNews() {
    return fetch(
      `${URL}/?key=${API_KEY}&q=${this.q}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    ).then(res =>
      res.json().then(data => {
        this.incrementPage();
        return data.hits;
      })
    );
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

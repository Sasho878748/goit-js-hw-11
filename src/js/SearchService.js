import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36471035-8dd0fed22317ca26f46d35a21';
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
}).toString();

export default class SearchService {
  constructor() {
    this.page = 1;
    this.q = '';
    this.totalHitsPhoto = '';
    this.hitsPhoto = '';
    this.photoBeenDownload = 0;
  }

  async getNews() {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.q}&per_page=40&page=${this.page}&${searchParams}`
    );
    const { hits, totalHits } = response.data;
    this.incrementPage();
    return {
      hits,
      totalHits,
    };
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36471035-8dd0fed22317ca26f46d35a21';

export default class SearchService {
  constructor() {
    this.page = 1;
    this.q = '';
  }

  async getNews() {
    try {
      const response = await axios.get(
        `${URL}/?key=${API_KEY}&q=${this.q}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=100`
      );
      const { hits, totalHits } = response.data;
      this.incrementPage();
      return {
        hits,
        totalHits,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}


import axios from 'axios';

export class PixabayAPI {
    #page = 1;
    #query = '';
    #per_page = 40;
    #totalPhotos = 0;

async getPhotos() {
    const params = {
        key: '33883650-6a998d5e0f5611a7d0f5afcf4',
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.#per_page,
        page: this.#page,
    };
    axios.defaults.baseURL = 'https://pixabay.com';
    const { data } = await axios.get(`/api/?`, { params });
    return data;
}

get query() {
    return this.#query;
}

set query(newQuery) {
    this.#query = newQuery;
}

incrementPage() {
    this.#page += 1;
}

resetPage() {
    this.#page = 1;
}

get totalPhotos() {
    return this.#totalPhotos;
}

set totalPhotos(newTotal) {
    this.#totalPhotos = newTotal;
}

MorePhotos() {
    return this.#page < Math.ceil(this.#totalPhotos / this.#per_page);
}
}


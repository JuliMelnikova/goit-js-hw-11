
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

import { PixabayAPI } from './js/pixabay-api';


const formElement = document.querySelector('form');
const galleryElement = document.querySelector('.gallery');
const btnElement = document.querySelector('button[type="submit"]');
const inputElement = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('visually-hidden');
const pixabay = new PixabayAPI();
let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionPosition: 'bottom',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
});


function renderGallery(results) {
    const markup = results
    .map(
        ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
    }) => {
        return `<a class="photo-card_wrapper" href="${largeImageURL}">
    <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class = "photo" />
        <div class="info">
            <p class="info-item">
                <b>Likes: </b> ${likes}
            </p>
            <p class="info-item">
                <b>Views: </b>${views}
            </p>
            <p class="info-item">
                <b>Comments: </b>${comments}
            </p>
            <p class="info-item">
                <b>Downloads: </b>${downloads}
            </p>
        </div>
    </div>
</a>`;
    }
    )
    .join('');
return markup;
}

async function handleSubmit(event) {
    event.preventDefault();
    const {
    elements: { searchQuery },
} = event.target;

const currentQuery = searchQuery.value.trim();

if (!currentQuery) {
    loadMoreBtn.classList.add('visually-hidden');
    galleryElement.innerHTML = '';
    Notiflix.Notify.warning('Please enter your query');
    return;
}

pixabay.query = currentQuery;
galleryElement.innerHTML = '';
pixabay.resetPage();

try {
    loadMoreBtn.classList.add('visually-hidden');
    const { hits, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
        loadMoreBtn.classList.add('visually-hidden');
        galleryElement.innerHTML = '';
        Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again. 😉'
        );
    return;
    }
    pixabay.totalPhotos = totalHits;
    const markup = renderGallery(hits);
    galleryElement.insertAdjacentHTML('beforeend', markup);
    const showMore = pixabay.MorePhotos();

    if (showMore) {
        loadMoreBtn.classList.remove('visually-hidden');
    } else {
        loadMoreBtn.classList.add('visually-hidden');
    }
    gallery.refresh();
} catch (error) {
    console.log(error);
    Notiflix.Notify.warning('You need to insert information to find 🤔');
}
event.target.reset();
}

async function handleLoadMoreClick(event) {
    pixabay.incrementPage();
    const showMore = pixabay.MorePhotos();
    
    if (!showMore) {
    loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results. 😋"
    );
}

try {
    const { hits } = await pixabay.getPhotos();
    const markup = renderGallery(hits);
    galleryElement.insertAdjacentHTML('beforeend', markup);

    gallery.refresh();
} catch (error) {
    Notiflix.Notify.warning('Something went wrong. Please try again! 🤗');
}
}

formElement.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);
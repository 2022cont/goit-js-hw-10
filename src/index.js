import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

import APICountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputCountry: document.getElementById('search-box'),
    infoSingleCountry: document.querySelector('.country-info'),
    listCountry: document.querySelector('.country-list')
};


const debouncedOnEventInput = debounce(onEventInput, DEBOUNCE_DELAY, { leading: true });
refs.inputCountry.addEventListener('input', debouncedOnEventInput);

function onEventInput(event) {
    const eventInput = event.target.value;

    APICountries.fetchCountries(eventInput.trim())
        .then(searchInfo)
        .catch(onFetchError)

};


function onFetchError() {
    clear();
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

function searchInfo(countres) {

    if (countres.length == 1) {
        clear();
        cardSingleCountry(countres);
    };
    if (countres.length >= 2 && countres.length <= 10) {
        clear();
        cardListCountres(countres);
    };
    if (countres.length > 10) {
        clear();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
};

function cardSingleCountry(itemCardCountry) {

    const itemcard = itemCardCountry.map(({ flags, name, capital, population, languages }) => {
        return `
        <ul>
        <li class="item-name">
        <img src="${flags.svg}" alt="Flag" style="width:40px;height:30px;"/>
        ${name.official}</li>
        <li><b>Capital:</b> ${capital}</li>
        <li><b>Population:</b> ${population}</li>
        <li><b>Languages:</b> ${Object.values(languages)}</li>
        </ul>
        `
    }).join('');

    refs.infoSingleCountry.insertAdjacentHTML('afterbegin', itemcard);
};

function cardListCountres(itemCardCountry) {

    const itemcard = itemCardCountry.map(({ flags, name, capital, population, languages }) => {
        return `
        <li>
        <img src="${flags.svg}" alt="Flag" style="width:30px;height:20px;"/>
        ${name.official}
        </li>
        `
    }).join('');

    refs.listCountry.insertAdjacentHTML('afterbegin', itemcard);
};

function clear() {
    refs.infoSingleCountry.innerHTML = '';
    refs.listCountry.innerHTML = '';
}
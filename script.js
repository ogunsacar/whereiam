'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// https://restcountries.com/v2/

// const getCountryAndNeighbour = function (country) {
//   // OLD WAY of AJAX CALL (1)
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     //render country
//     renderCountry(data);
//     // get neighbour country
//     const [neighbour] = data.borders;
//     if (!neighbour) return;

//     // AJAX CALL(2)
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// getCountryAndNeighbour('spain');

// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v2/name/${country}`);
// request.send();

// const request = fetch('https://restcountries.com/v2/name/portugal');

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      //   console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(res => res.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} ❗❗❗`);
      renderError(err);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', function () {
//   getCountryData('turkey');
// });

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
    </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     // then methodu bağlanabilmesi için promise döndür.
//     setTimeout(resolve, seconds * 1000); // .. sn sonra resolve et
//   });
// };

// wait(2)
//   .then(() => {
//     // resolve edildiğinde bu kod bloğunu çalıştır.
//     console.log('I waited for 2 seconds');
//     return wait(1); // tekrar promise döndür
//   })
//   .then(() => console.log('I waited for 1 second')); // tekrar resolve edildiğinde bu kod bloğunu çalıştır.

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function (country) {
  try {
    const pos = await getPosition();
    const [lat, lng] = [pos.coords.latitude, pos.coords.longitude];

    // const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    // const dataGeo = await resGeo.json();

    // if (!resGeo.ok) throw new Error('Problem getting location data!');

    const res = await fetch(`https://restcountries.com/v2/name/${country}`);
    console.log(res);
    if (!res.ok) throw new Error('There is no country like that bruh...');

    const data = await res.json();
    renderCountry(data[0]);
  } catch (err) {
    console.log(err);
    renderError(err);
  }
};

whereAmI('turkey');

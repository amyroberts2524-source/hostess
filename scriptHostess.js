const guestHouseContainer = document.querySelector('#guestHouseContainer');
const houseCount = document.querySelector('#house-count');
const filterButtons = document.querySelectorAll('[data-filter]');

let activeFilters = [];
let guestHouses = [];


async function loadGuestHouses() {

  const response = await fetch('/api/guest-houses');

  guestHouses = await response.json();

  displayGuestHouses();

}


function displayGuestHouses() {

  guestHouseContainer.innerHTML = '';

  let visibleHouses = 0;

  guestHouses.forEach((house) => {

    let matchesFilters = true;

    activeFilters.forEach((filter) => {

      if (filter === 'bathrooms') {

        if (house.bathrooms < 1) {
          matchesFilters = false;
        }

      } else if (filter === 'mall') {

        if (!house.close_to_mall) {
          matchesFilters = false;
        }

      } else if (filter === 'cbd') {

        if (!house.close_to_cbd) {
          matchesFilters = false;
        }

      } else {

        if (!house[filter]) {
          matchesFilters = false;
        }

      }

    });


    if (matchesFilters) {

      const guestHouse = document.createElement('div');

      guestHouse.classList.add('guest-house');

      guestHouse.innerHTML = `
        <img src="${house.image}">
        <p>Guest house in ${house.location}</p>
        <p>${house.name}</p>
        <p>N$${Number(house.price).toFixed(0)} per night</p>
      `;

      guestHouseContainer.appendChild(guestHouse);

      visibleHouses++;

    }

  });

  houseCount.textContent = visibleHouses;

}


filterButtons.forEach((button) => {

  button.addEventListener('click', () => {

    const filter = button.dataset.filter;

    if (filter === 'all') {

      activeFilters = [];

      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
      });

    } else if (activeFilters.includes(filter)) {

      activeFilters = activeFilters.filter((item) => {
        return item !== filter;
      });

      button.classList.remove('active');

    } else {

      activeFilters.push(filter);

      button.classList.add('active');

    }

    displayGuestHouses();

  });

});


const profileButton = document.querySelector('#profileButton');
const profileDropdown = document.querySelector('#profileDropdown');

profileButton.addEventListener('click', () => {
  profileDropdown.classList.toggle('show');
});


loadGuestHouses();
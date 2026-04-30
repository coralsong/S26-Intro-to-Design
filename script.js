// creates map
const map = L.map('map').setView([40.7359, -73.9911], 15);

const bounds = L.latLngBounds(
    [40.7003, -74.0200],
    [40.8820, -73.9070]
);

map.setMaxBounds(bounds);
map.options.maxBoundsViscosity = 1.0;

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 13.5,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const delis = [
    {
        name: 'Square Deli',
        detailsId: 'square-deli',
        address: '168 8th Ave, New York, NY 10011',
        lat: 40.74235,
        lng: -74.00079,
        url: 'https://www.yelp.com/biz/square-deli-new-york-2'
    },
    {
        name: 'Kips Bay Deli',
        detailsId: 'kipsbay-deli',
        address: '545 2nd Ave, New York, NY 10016',
        lat: 40.74224,
        lng: -73.97835,
        url: 'https://www.yelp.com/biz/square-deli-new-york-2'
    },
    {
        name: 'Stuytown Market Place',
        detailsId: 'stuytown-market',
        address: '279 1st Ave, New York, NY 10003',
        lat: 40.73263,
        lng: -73.98133,
        url: 'https://www.instagram.com/stuytownmarketplace/'
    }
];

function openDeliDetails(detailsId) {
    const deliSection = document.getElementById(detailsId);
    const details = deliSection?.querySelector('details');

    if (!deliSection || !details) {
        return;
    }

    details.open = true;
    deliSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const deliMarkers = delis.map((deli) => {
    const marker = L.marker([deli.lat, deli.lng]).addTo(map);

    marker.bindPopup(`
        <button class="popup-store-name" type="button" data-details-id="${deli.detailsId}">
            ${deli.name}
        </button><br>
        <a href="${deli.url}" target="_blank" rel="noopener">${deli.address}</a>
    `);

    marker.on('popupopen', (event) => {
        const popupElement = event.popup.getElement();
        const storeButton = popupElement.querySelector('.popup-store-name');

        storeButton.addEventListener('click', () => {
            openDeliDetails(storeButton.dataset.detailsId);
        });
    });

    return marker;
});

map.fitBounds(L.featureGroup(deliMarkers).getBounds().pad(0.3));

// submission form
const submissionForm = document.getElementById('submissionForm');
const storeNameInput = document.getElementById('storeName');
const eggPriceInput = document.getElementById('eggPrice');    
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');

let clickedLatLng = null;

if (submissionForm && storeNameInput && eggPriceInput && submitButton && cancelButton) {
    // opens form when map is clicked
    map.on('click', (e) => {
        clickedLatLng = e.latlng;
        submissionForm.classList.add('active');
    });

    // places pin when form is submitted
    submitButton.addEventListener('click', () => {
        const storeName = storeNameInput.value.trim(); 
        const eggPrice = eggPriceInput.value.trim();   

        if (!storeName || !eggPrice) {
            alert('Please fill in both the store name and price.');
            return;
        }

        const marker = L.marker(clickedLatLng).addTo(map);
        marker.bindPopup(`
            <b>${storeName}</b><br>
            Eggs: $${parseFloat(eggPrice).toFixed(2)} per dozen
        `).openPopup();

        storeNameInput.value = ''; 
        eggPriceInput.value = ''; 
        submissionForm.classList.remove('active');
        clickedLatLng = null;
    });

    // closes form on cancel
    cancelButton.addEventListener('click', () => {
        storeNameInput.value = '';
        eggPriceInput.value = '';
        submissionForm.classList.remove('active');
        clickedLatLng = null;
    });
}

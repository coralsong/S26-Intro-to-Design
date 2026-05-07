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
        name: 'Punjabi Deli',
        detailsId: 'punjabi-deli',
        address: '114 E 1st St, New York, NY 10009',
        lat: 40.72395,
        lng: -73.98780,
        url: 'https://places.singleplatform.com'
    },
    {
        name: 'Brooklyn Fare Deli',
        detailsId: 'brooklyn-fare',
        address: '227 Cherry St, New York, NY 10002',
        lat: 40.71072,
        lng: -73.98882,
        url: 'https://shop.brooklynfare.com/retailer/information/3198'
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

const redDeliIcon = L.divIcon({
    className: 'red-deli-pin',
    iconSize: [34, 46],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
    html: `
        <svg viewBox="0 0 34 46" width="34" height="46" aria-hidden="true">
            <path d="M17 45C13 36 3 27 3 17A14 14 0 0 1 31 17C31 27 21 36 17 45Z"
                fill="#ff1616" stroke="#ffffff" stroke-width="3" />
            <circle cx="17" cy="17" r="6" fill="#ffffff" />
        </svg>
    `
});

const tramIcon = L.divIcon({
    className: 'tram-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: '<span aria-hidden="true">🚋</span>'
});

const deliRoutes = [
    {
        color: '#0057b8',
        stops: [
            [40.74235, -74.00079],
            [40.7472, -73.9917],
            [40.74224, -73.97835]
        ]
    },
    {
        color: '#00843d',
        stops: [
            [40.74224, -73.97835],
            [40.7373, -73.97835],
            [40.73263, -73.98133]
        ]
    },
    {
        color: '#ff6319',
        stops: [
            [40.73263, -73.98133],
            [40.7281, -73.9844],
            [40.72395, -73.98780]
        ]
    },
    {
        color: '#b933ad',
        stops: [
            [40.72395, -73.98780],
            [40.7173, -73.9878],
            [40.71072, -73.98882]
        ]
    },
    {
        color: '#fccc0a',
        stops: [
            [40.71072, -73.98882],
            [40.7192, -73.9961],
            [40.7319, -74.00079],
            [40.74235, -74.00079]
        ]
    }
];

function drawMetroRoute(route) {
    L.polyline(route.stops, {
        color: '#ffffff',
        weight: 13,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);

    L.polyline(route.stops, {
        color: route.color,
        weight: 8,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);
}

deliRoutes.forEach(drawMetroRoute);

const tramPath = [
    [40.74235, -74.00079],
    [40.7472, -73.9917],
    [40.74224, -73.97835],
    [40.7373, -73.97835],
    [40.73263, -73.98133],
    [40.7281, -73.9844],
    [40.72395, -73.98780],
    [40.7173, -73.9878],
    [40.71072, -73.98882],
    [40.7192, -73.9961],
    [40.7319, -74.00079],
    [40.74235, -74.00079]
];

const tramMarker = L.marker(tramPath[0], {
    icon: tramIcon,
    interactive: false,
    zIndexOffset: 1000
}).addTo(map);

let tramSegment = 0;
let tramProgress = 0;

function moveTram() {
    const start = tramPath[tramSegment];
    const end = tramPath[(tramSegment + 1) % tramPath.length];
    const lat = start[0] + (end[0] - start[0]) * tramProgress;
    const lng = start[1] + (end[1] - start[1]) * tramProgress;

    tramMarker.setLatLng([lat, lng]);

    tramProgress += 0.008;

    if (tramProgress >= 1) {
        tramProgress = 0;
        tramSegment = (tramSegment + 1) % tramPath.length;
    }

    requestAnimationFrame(moveTram);
}

moveTram();

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
    const marker = L.marker([deli.lat, deli.lng], { icon: redDeliIcon }).addTo(map);

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

        const marker = L.marker(clickedLatLng, { icon: redDeliIcon }).addTo(map);
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

// Airbnb Clone - Interactive JavaScript

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showNotification('Theme updated', 'success');
});

// Modal Management
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal.querySelector('.modal-overlay');
        this.closeBtn = this.modal.querySelector('.modal-close');

        this.overlay?.addEventListener('click', () => this.close());
        this.closeBtn?.addEventListener('click', () => this.close());
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize Modals
const searchModal = new Modal('searchModal');
const userDropdown = document.getElementById('userDropdown');
const authModal = new Modal('authModal');
const filtersModal = new Modal('filtersModal');
const propertyModal = new Modal('propertyModal');

// Search Trigger
document.getElementById('searchTrigger').addEventListener('click', () => {
    searchModal.open();
});

// Search Tabs
document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Guest Counter
const guestCounts = {
    adults: 0,
    children: 0,
    pets: 0
};

document.querySelectorAll('.guest-controls button').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const type = button.dataset.type;

        if (action === 'plus') {
            guestCounts[type]++;
        } else if (action === 'minus' && guestCounts[type] > 0) {
            guestCounts[type]--;
        }

        document.getElementById(`${type}Count`).textContent = guestCounts[type];
        updateGuestDisplay();
    });
});

function updateGuestDisplay() {
    const total = guestCounts.adults + guestCounts.children;
    const guestText = total === 0 ? 'Add guests' : `${total} guest${total > 1 ? 's' : ''}`;
    document.querySelector('.guests-text').textContent = guestText;
}

// Clear Search
document.getElementById('clearSearch').addEventListener('click', () => {
    guestCounts.adults = 0;
    guestCounts.children = 0;
    guestCounts.pets = 0;

    document.getElementById('adultsCount').textContent = '0';
    document.getElementById('childrenCount').textContent = '0';
    document.getElementById('petsCount').textContent = '0';
    document.getElementById('searchDestination').value = '';
    document.getElementById('checkIn').value = '';
    document.getElementById('checkOut').value = '';

    updateGuestDisplay();
    showNotification('Search cleared', 'info');
});

// Execute Search
document.getElementById('executeSearch').addEventListener('click', () => {
    const destination = document.getElementById('searchDestination').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    if (!destination || !checkIn || !checkOut) {
        showNotification('Please fill in all search fields', 'error');
        return;
    }

    searchModal.close();
    showNotification(`Searching for stays in ${destination}...`, 'success');
    filterListings();
});

// User Menu Dropdown
document.getElementById('userMenu').addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu') && !e.target.closest('#userDropdown')) {
        userDropdown.classList.remove('active');
    }
});

// Auth Modal Triggers
document.getElementById('loginBtn').addEventListener('click', () => {
    userDropdown.classList.remove('active');
    document.getElementById('authTitle').textContent = 'Log in';
    authModal.open();
});

document.getElementById('signupBtn').addEventListener('click', () => {
    userDropdown.classList.remove('active');
    document.getElementById('authTitle').textContent = 'Sign up';
    authModal.open();
});

// Auth Form
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const title = document.getElementById('authTitle').textContent;

    authModal.close();
    showNotification(`${title} successful! Welcome, ${email}`, 'success');

    // Clear form
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
});

// Social Auth Buttons
document.getElementById('googleAuth').addEventListener('click', () => {
    showNotification('Google authentication initiated', 'info');
});

document.getElementById('facebookAuth').addEventListener('click', () => {
    showNotification('Facebook authentication initiated', 'info');
});

document.getElementById('appleAuth').addEventListener('click', () => {
    showNotification('Apple authentication initiated', 'info');
});

// Other User Actions
document.getElementById('becomeHost').addEventListener('click', () => {
    showNotification('Host registration page would open here', 'info');
});

document.getElementById('hostHomeBtn').addEventListener('click', () => {
    userDropdown.classList.remove('active');
    showNotification('Host your home page would open here', 'info');
});

document.getElementById('helpBtn').addEventListener('click', () => {
    userDropdown.classList.remove('active');
    showNotification('Help center would open here', 'info');
});

// Category Filter
let activeCategory = 'all';

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        filterListings();
    });
});

// Filters Modal
document.getElementById('filtersBtn').addEventListener('click', () => {
    filtersModal.open();
});

// Price Range Inputs
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const minPriceRange = document.getElementById('minPriceRange');
const maxPriceRange = document.getElementById('maxPriceRange');

minPriceInput.addEventListener('input', (e) => {
    minPriceRange.value = e.target.value;
});

maxPriceInput.addEventListener('input', (e) => {
    maxPriceRange.value = e.target.value;
});

minPriceRange.addEventListener('input', (e) => {
    minPriceInput.value = e.target.value;
});

maxPriceRange.addEventListener('input', (e) => {
    maxPriceInput.value = e.target.value;
});

// Property Type Filter
document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('active');
    });
});

// Room Filters
const roomCounts = {
    bedrooms: null,
    bathrooms: null
};

document.querySelectorAll('.room-controls button').forEach(button => {
    button.addEventListener('click', () => {
        const room = button.dataset.room;
        const action = button.dataset.action;

        if (roomCounts[room] === null) {
            roomCounts[room] = 0;
        }

        if (action === 'plus') {
            roomCounts[room]++;
        } else if (action === 'minus' && roomCounts[room] > 0) {
            roomCounts[room]--;
            if (roomCounts[room] === 0) {
                roomCounts[room] = null;
            }
        }

        const display = roomCounts[room] === null ? 'Any' : roomCounts[room];
        document.getElementById(`${room}Count`).textContent = display;
    });
});

// Clear Filters
document.getElementById('clearFilters').addEventListener('click', () => {
    minPriceInput.value = '0';
    maxPriceInput.value = '1000';
    minPriceRange.value = '0';
    maxPriceRange.value = '1000';

    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    roomCounts.bedrooms = null;
    roomCounts.bathrooms = null;
    document.getElementById('bedroomsCount').textContent = 'Any';
    document.getElementById('bathroomsCount').textContent = 'Any';

    showNotification('Filters cleared', 'info');
});

// Apply Filters
document.getElementById('applyFilters').addEventListener('click', () => {
    filtersModal.close();
    showNotification('Filters applied', 'success');
    filterListings();
});

// View Toggle
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        const listingsContainer = document.getElementById('listingsContainer');

        if (view === 'list') {
            listingsContainer.classList.add('list-view');
        } else {
            listingsContainer.classList.remove('list-view');
        }
    });
});

// Property Data
const properties = [
    {
        id: 1,
        title: 'Luxury Beachfront Villa',
        location: 'Malibu, California',
        type: 'villa',
        category: 'beachfront',
        rating: 4.95,
        reviews: 124,
        price: 850,
        host: 'Sarah',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Experience luxury living in this stunning beachfront villa with panoramic ocean views. Perfect for families and groups seeking an unforgettable coastal getaway.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Pool', 'Hot tub', 'Beach access', 'Air conditioning', 'Washer & Dryer'],
        images: 5,
        badge: 'Superhost',
        featured: true
    },
    {
        id: 2,
        title: 'Modern Downtown Apartment',
        location: 'New York City, NY',
        type: 'apartment',
        category: 'city',
        rating: 4.87,
        reviews: 89,
        price: 295,
        host: 'Michael',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Stylish apartment in the heart of Manhattan. Walking distance to top attractions, restaurants, and entertainment.',
        amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Gym', 'Doorman'],
        images: 5,
        badge: null,
        featured: false
    },
    {
        id: 3,
        title: 'Cozy Mountain Cabin',
        location: 'Aspen, Colorado',
        type: 'cabin',
        category: 'cabin',
        rating: 4.92,
        reviews: 156,
        price: 425,
        host: 'Jennifer',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Escape to the mountains in this charming cabin surrounded by nature. Perfect for winter skiing or summer hiking adventures.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Fireplace', 'Hot tub', 'Ski-in/Ski-out'],
        images: 5,
        badge: 'Superhost',
        featured: true
    },
    {
        id: 4,
        title: 'Tropical Paradise Pool Villa',
        location: 'Bali, Indonesia',
        type: 'villa',
        category: 'pool',
        rating: 4.98,
        reviews: 203,
        price: 320,
        host: 'Made',
        guests: 6,
        bedrooms: 3,
        bathrooms: 3,
        description: 'Immerse yourself in Balinese luxury with this stunning villa featuring a private infinity pool and lush tropical gardens.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning', 'Garden', 'Daily cleaning'],
        images: 5,
        badge: 'Superhost',
        featured: true
    },
    {
        id: 5,
        title: 'Waterfront Luxury Estate',
        location: 'Miami Beach, Florida',
        type: 'house',
        category: 'luxury',
        rating: 4.96,
        reviews: 94,
        price: 1250,
        host: 'Carlos',
        guests: 10,
        bedrooms: 5,
        bathrooms: 5,
        description: 'Ultra-luxury waterfront estate with private dock, infinity pool, and breathtaking views. The ultimate Miami experience.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Pool', 'Hot tub', 'Gym', 'Home theater', 'Private dock'],
        images: 5,
        badge: 'Luxe',
        featured: true
    },
    {
        id: 6,
        title: 'Charming Paris Loft',
        location: 'Paris, France',
        type: 'apartment',
        category: 'city',
        rating: 4.89,
        reviews: 112,
        price: 385,
        host: 'Sophie',
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: 'Experience Parisian charm in this beautifully renovated loft in Le Marais. Steps from cafes, galleries, and the Seine.',
        amenities: ['WiFi', 'Kitchen', 'Washer', 'Historic building'],
        images: 5,
        badge: null,
        featured: false
    },
    {
        id: 7,
        title: 'Oceanfront Beach House',
        location: 'Cape Cod, Massachusetts',
        type: 'house',
        category: 'beachfront',
        rating: 4.91,
        reviews: 78,
        price: 675,
        host: 'David',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Classic New England beach house with direct beach access. Perfect for summer vacations and family gatherings.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Beach access', 'Deck', 'Fire pit'],
        images: 5,
        badge: 'Superhost',
        featured: false
    },
    {
        id: 8,
        title: 'Modern Pool House',
        location: 'Los Angeles, California',
        type: 'house',
        category: 'pool',
        rating: 4.94,
        reviews: 167,
        price: 550,
        host: 'Jessica',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Contemporary luxury in the Hollywood Hills. Stunning city views, infinity pool, and designer interiors.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning', 'Gym', 'City views'],
        images: 5,
        badge: 'Superhost',
        featured: true
    },
    {
        id: 9,
        title: 'Rustic Lakefront Cabin',
        location: 'Lake Tahoe, Nevada',
        type: 'cabin',
        category: 'cabin',
        rating: 4.88,
        reviews: 145,
        price: 395,
        host: 'Robert',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Peaceful lakefront retreat with private dock and mountain views. Perfect for all seasons.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Fireplace', 'Deck', 'Lake access', 'Kayaks'],
        images: 5,
        badge: null,
        featured: false
    },
    {
        id: 10,
        title: 'Penthouse with City Views',
        location: 'Chicago, Illinois',
        type: 'apartment',
        category: 'luxury',
        rating: 4.97,
        reviews: 86,
        price: 725,
        host: 'Amanda',
        guests: 6,
        bedrooms: 3,
        bathrooms: 3,
        description: 'Spectacular penthouse with floor-to-ceiling windows and panoramic city views. Ultimate luxury living.',
        amenities: ['WiFi', 'Kitchen', 'Gym', 'Doorman', 'Air conditioning', 'Terrace', 'City views'],
        images: 5,
        badge: 'Luxe',
        featured: true
    },
    {
        id: 11,
        title: 'Tropical Beach Bungalow',
        location: 'Tulum, Mexico',
        type: 'house',
        category: 'beachfront',
        rating: 4.93,
        reviews: 134,
        price: 285,
        host: 'Maria',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Bohemian beach bungalow steps from the turquoise Caribbean. Eco-friendly and beautifully designed.',
        amenities: ['WiFi', 'Kitchen', 'Beach access', 'Air conditioning', 'Outdoor shower'],
        images: 5,
        badge: 'Superhost',
        featured: false
    },
    {
        id: 12,
        title: 'Alpine Ski Chalet',
        location: 'Chamonix, France',
        type: 'cabin',
        category: 'trending',
        rating: 4.95,
        reviews: 92,
        price: 895,
        host: 'Pierre',
        guests: 10,
        bedrooms: 5,
        bathrooms: 4,
        description: 'Luxury ski chalet with Mont Blanc views. Direct access to slopes and world-class skiing.',
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Fireplace', 'Hot tub', 'Ski storage', 'Sauna'],
        images: 5,
        badge: 'Superhost',
        featured: true
    }
];

// Favorites Management
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(propertyId) {
    const index = favorites.indexOf(propertyId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(propertyId);
        showNotification('Added to favorites', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderListings();
}

// Filter Listings
function filterListings() {
    const filtered = properties.filter(property => {
        if (activeCategory !== 'all' && property.category !== activeCategory) {
            return false;
        }
        return true;
    });

    renderListings(filtered);
}

// Render Listings
function renderListings(listingsToRender = properties) {
    const container = document.getElementById('listingsContainer');
    container.innerHTML = '';

    listingsToRender.forEach((property, index) => {
        const isFavorited = favorites.includes(property.id);

        const card = document.createElement('div');
        card.className = 'listing-card';
        card.style.animationDelay = `${index * 50}ms`;

        card.innerHTML = `
            <div class="listing-image-container">
                <img src="images/property-${property.id}.jpg" 
                     alt="${property.title}" 
                     class="listing-image"
                     loading="lazy">
                <button class="listing-favorite ${isFavorited ? 'active' : ''}" data-id="${property.id}">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                ${property.badge ? `<div class="listing-badge">${property.badge}</div>` : ''}
            </div>
            <div class="listing-info">
                <div class="listing-header">
                    <div class="listing-location">${property.location}</div>
                    <div class="listing-rating">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        ${property.rating}
                    </div>
                </div>
                <div class="listing-details">${property.title}</div>
                <div class="listing-details">${property.guests} guests · ${property.bedrooms} bedrooms · ${property.bathrooms} baths</div>
                <div class="listing-price"><strong>$${property.price}</strong> per night</div>
            </div>
        `;

        // Add click handler for property details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.listing-favorite')) {
                showPropertyDetails(property);
            }
        });

        // Add favorite button handler
        const favoriteBtn = card.querySelector('.listing-favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
        });

        container.appendChild(card);
    });
}

// Show Property Details
function showPropertyDetails(property) {
    const detailsContainer = document.getElementById('propertyDetails');

    detailsContainer.innerHTML = `
        <div class="property-header">
            <h2 class="property-title">${property.title}</h2>
            <div class="property-subtitle">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; fill: currentColor;">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                ${property.rating} · ${property.reviews} reviews · ${property.location}
            </div>
        </div>
        
        
        <div class="property-images">
            <img src="images/property-${property.id}.jpg" 
                 alt="${property.title}" 
                 class="property-main-image">
            <img src="images/interior.jpg" 
                 alt="Interior" 
                 class="property-grid-image">
            <img src="images/bedroom.jpg" 
                 alt="Bedroom" 
                 class="property-grid-image">
            <img src="images/bathroom.jpg" 
                 alt="Bathroom" 
                 class="property-grid-image">
            <img src="images/kitchen.jpg" 
                 alt="Kitchen" 
                 class="property-grid-image">
        </div>
        
        <div class="property-body">
            <div class="property-details">
                <h3>${property.type.charAt(0).toUpperCase() + property.type.slice(1)} hosted by ${property.host}</h3>
                
                <div class="property-host">
                    <div class="host-avatar">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="host-info">
                        <h4>Hosted by ${property.host}</h4>
                        <p>${property.badge || 'Host'}</p>
                    </div>
                </div>
                
                <div class="property-features">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h5>Entire ${property.type}</h5>
                            <p>You'll have the ${property.type} to yourself</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h5>Enhanced Clean</h5>
                            <p>This host committed to Airbnb's cleaning protocol</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h5>Great check-in experience</h5>
                            <p>100% of recent guests gave the check-in process a 5-star rating</p>
                        </div>
                    </div>
                </div>
                
                <div class="property-description">
                    <p>${property.description}</p>
                </div>
                
                <div class="property-amenities">
                    <h3>What this place offers</h3>
                    <div class="amenities-list">
                        ${property.amenities.map(amenity => `
                            <div class="amenity-item">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                <span>${amenity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="booking-card">
                <div class="booking-price">
                    <strong>$${property.price}</strong> <span>night</span>
                </div>
                
                <div class="booking-dates">
                    <div class="booking-date">
                        <label>CHECK-IN</label>
                        <input type="date" id="bookingCheckIn">
                    </div>
                    <div class="booking-date">
                        <label>CHECKOUT</label>
                        <input type="date" id="bookingCheckOut">
                    </div>
                </div>
                
                <div class="booking-guests">
                    <label>GUESTS</label>
                    <select id="bookingGuests">
                        ${Array.from({ length: property.guests }, (_, i) => i + 1).map(num =>
        `<option value="${num}">${num} guest${num > 1 ? 's' : ''}</option>`
    ).join('')}
                    </select>
                </div>
                
                <button class="btn-primary btn-full" id="reserveBtn">Reserve</button>
                
                <div class="booking-summary">
                    <div class="summary-row">
                        <span>$${property.price} x 5 nights</span>
                        <span>$${property.price * 5}</span>
                    </div>
                    <div class="summary-row">
                        <span>Cleaning fee</span>
                        <span>$50</span>
                    </div>
                    <div class="summary-row">
                        <span>Service fee</span>
                        <span>$${Math.round(property.price * 5 * 0.12)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>$${property.price * 5 + 50 + Math.round(property.price * 5 * 0.12)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    propertyModal.open();

    // Add reserve button handler
    setTimeout(() => {
        document.getElementById('reserveBtn')?.addEventListener('click', () => {
            const checkIn = document.getElementById('bookingCheckIn').value;
            const checkOut = document.getElementById('bookingCheckOut').value;
            const guests = document.getElementById('bookingGuests').value;

            if (!checkIn || !checkOut) {
                showNotification('Please select check-in and check-out dates', 'error');
                return;
            }

            propertyModal.close();
            showNotification(`Reservation confirmed for ${property.title}!`, 'success');
        });
    }, 100);
}

// Load More
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    showNotification('Loading more properties...', 'info');
    setTimeout(() => {
        renderListings();
        showNotification('More properties loaded', 'success');
    }, 800);
});

// Footer Links - All Interactive
const footerLinks = {
    helpCenterLink: 'Help Center',
    safetyLink: 'Safety Information',
    cancellationLink: 'Cancellation Options',
    covidLink: 'COVID-19 Response',
    disasterLink: 'Disaster Relief Housing',
    diversityLink: 'Diversity & Belonging',
    accessibilityLink: 'Accessibility',
    tryHostingLink: 'Try Hosting',
    coverLink: 'AirCover for Hosts',
    resourcesLink: 'Hosting Resources',
    forumLink: 'Community Forum',
    newsLink: 'Newsroom',
    featuresLink: 'New Features',
    careersLink: 'Careers',
    investorsLink: 'Investors',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    sitemapLink: 'Sitemap'
};

Object.keys(footerLinks).forEach(linkId => {
    document.getElementById(linkId)?.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification(`Opening ${footerLinks[linkId]}...`, 'info');
    });
});

// Language and Currency
document.getElementById('languageBtn')?.addEventListener('click', () => {
    showNotification('Language selector would open here', 'info');
});

document.getElementById('currencyBtn')?.addEventListener('click', () => {
    showNotification('Currency selector would open here', 'info');
});

// Social Links
document.getElementById('fbLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Opening Facebook...', 'info');
});

document.getElementById('twitterLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Opening Twitter...', 'info');
});

document.getElementById('igLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Opening Instagram...', 'info');
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInFromRight 0.3s ease-in-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initial Render
renderListings();

// Show welcome message
setTimeout(() => {
    showNotification('Welcome to Airbnb! Find your perfect stay.', 'success');
}, 500);

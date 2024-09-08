// Elementos del DOM
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progressBar = document.querySelector('.progress');
const currentTimeElement = document.querySelector('.current-time');
const totalTimeElement = document.querySelector('.total-time');
const volumeSlider = document.querySelector('.volume-slider');
const songTitleElement = document.querySelector('.song-title');
const artistElement = document.querySelector('.artist');
const albumCoverElement = document.querySelector('.album-cover');

// Estado de la aplicación
let isPlaying = false;
let currentTime = 0;
let totalTime = 180;
let volume = 50;
let intervalId = null;
let currentSongIndex = 0;

// Lista de canciones de ejemplo
const songs = [
    { title: 'Canción 1', artist: 'Artista 1', duration: 180, cover: 'https://via.placeholder.com/60?text=1' },
    { title: 'Canción 2', artist: 'Artista 2', duration: 240, cover: 'https://via.placeholder.com/60?text=2' },
    { title: 'Canción 3', artist: 'Artista 3', duration: 200, cover: 'https://via.placeholder.com/60?text=3' },
];

// Funciones de control de reproducción
function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        startProgress();
    } else {
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        stopProgress();
    }
}

function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        startProgress();
    } else {
        resetProgress();
    }
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        startProgress();
    } else {
        resetProgress();
    }
}

// Funciones de progreso
function startProgress() {
    stopProgress();
    intervalId = setInterval(() => {
        currentTime += 1;
        updateProgressBar();
        updateTimeDisplay();
        if (currentTime >= totalTime) {
            playNextSong();
        }
    }, 1000);
}

function stopProgress() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function resetProgress() {
    currentTime = 0;
    updateProgressBar();
    updateTimeDisplay();
}

function updateProgressBar() {
    const progress = (currentTime / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateTimeDisplay() {
    currentTimeElement.textContent = formatTime(currentTime);
    totalTimeElement.textContent = formatTime(totalTime);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Función de control de volumen
function adjustVolume() {
    volume = volumeSlider.value;
    // Aquí iría la lógica real para ajustar el volumen
}

// Función para cargar una canción
function loadSong(index) {
    const song = songs[index];
    songTitleElement.textContent = song.title;
    artistElement.textContent = song.artist;
    albumCoverElement.src = song.cover;
    totalTime = song.duration;
    resetProgress();
}

// Event listeners
playPauseButton.addEventListener('click', togglePlayPause);
prevButton.addEventListener('click', playPreviousSong);
nextButton.addEventListener('click', playNextSong);
volumeSlider.addEventListener('input', adjustVolume);
window.addEventListener('load', adjustLayoutForMobile);
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('song-details-sidebar');
    if (sidebar.classList.contains('active')) {
        adjustSidebarForMobile();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const playlistForm = document.getElementById('playlist-form');
    const songSearch = document.getElementById('song-search');
    const searchButton = document.getElementById('search-button');
    const searchResultsList = document.getElementById('search-results-list');

    if (playlistForm) {
        playlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const playlistName = document.getElementById('playlist-name').value;
            const playlistDescription = document.getElementById('playlist-description').value;
            const playlistPrivacy = document.getElementById('playlist-privacy').value;

            // Se dejan los datos para su futuro manejo
            console.log('Nueva playlist creada:', { playlistName, playlistDescription, playlistPrivacy });
            alert('Playlist creada con éxito!');
        });
    }

    if (searchButton && songSearch) {
        searchButton.addEventListener('click', function() {
            const searchTerm = songSearch.value;
            // Simulación de busqueda
            const searchResults = [
                { id: 1, title: 'Canción 1', artist: 'Artista 1', image: 'https://via.placeholder.com/50' },
                { id: 2, title: 'Canción 2', artist: 'Artista 2', image: 'https://via.placeholder.com/50' },
                { id: 3, title: 'Canción 3', artist: 'Artista 3', image: 'https://via.placeholder.com/50' }
            ];
            displaySearchResults(searchResults);
        });
    }

    function displaySearchResults(results) {
        searchResultsList.innerHTML = '';
        results.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song-item');
            songElement.innerHTML = `
                <img src="${song.image}" alt="${song.title}">
                <div class="song-item-info">
                    <div class="song-item-title">${song.title}</div>
                    <div class="song-item-artist">${song.artist}</div>
                </div>
                <button class="btn-add-song" data-id="${song.id}">Añadir</button>
            `;
            searchResultsList.appendChild(songElement);
        });

        const addButtons = document.querySelectorAll('.btn-add-song');
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const songId = this.getAttribute('data-id');
                console.log('Canción añadida a la playlist:', songId);
                alert('Canción añadida a la playlist!');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedItems();
    loadRecommendations();
    loadLibraryContent();
    loadSong(currentSongIndex);
    updateTimeDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            alert('Inicio de sesión simulado. En la plicación real, aquí se manejará la autenticación.');
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            /* Aquí irá la lógica de validación y envío del formulario
            Por ahora solo es una simulación para tener los datos a mano */
            console.log('Intento de registro:', {
                username: document.getElementById('username').value,
                rut: document.getElementById('rut').value,
                email: document.getElementById('email').value,
                region: document.getElementById('region').value,
                comuna: document.getElementById('comuna').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirm-password').value,
                terms: document.getElementById('terms').checked
            });
            alert('Registro simulado. En la aplicación real, aquí se manejará el proceso de registro.');
        });
    }

    // Carga a modo ejemplo de las regiones
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        const regiones = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', 'OHiggins', 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'];
        regiones.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });

        // Evento para cargar comunas cuando se selecciona una región
        regionSelect.addEventListener('change', () => {
            const comunaSelect = document.getElementById('comuna');
            comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
            // Aquí se cargarán las comunas reales basadas en la región seleccionada
            // Por ahora, solo añadiremos algunas comunas de ejemplo
            const comunasEjemplo = ['Comuna 1', 'Comuna 2', 'Comuna 3'];
            comunasEjemplo.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        });
    }
});

function loadFeaturedItems() {
    const featuredContainer = document.querySelector('.featured-items');
    if (!featuredContainer) return;
    
    // Carga a modo de ejemplo
    const items = [
        { title: 'Playlist 1', image: 'https://via.placeholder.com/150' },
        { title: 'Playlist 2', image: 'https://via.placeholder.com/150' },
        { title: 'Playlist 3', image: 'https://via.placeholder.com/150' },
        { title: 'Playlist 4', image: 'https://via.placeholder.com/150' },
    ];

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <p>${item.title}</p>
        `;
        featuredContainer.appendChild(itemElement);
    });
}

function loadRecommendations() {
    const recommendationsContainer = document.querySelector('.recommendation-items');
    if (!recommendationsContainer) return;
    
    // Carga a modo de ejemplo
    const items = [
        { title: 'Canción 1', artist: 'Artista 1', image: 'https://via.placeholder.com/150' },
        { title: 'Canción 2', artist: 'Artista 2', image: 'https://via.placeholder.com/150' },
        { title: 'Canción 3', artist: 'Artista 3', image: 'https://via.placeholder.com/150' },
        { title: 'Canción 4', artist: 'Artista 4', image: 'https://via.placeholder.com/150' },
    ];

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <p>${item.title}</p>
            <p class="artist">${item.artist}</p>
        `;
        recommendationsContainer.appendChild(itemElement);
    });
}

// Carga de distintos elementos de librería
function loadLibraryContent() {
    loadFavorites();
    loadPlaylists();
    loadAlbums();
    loadArtists();
}

function loadPlaylists() {
    const playlistContainer = document.querySelector('.playlist-grid');
    if (!playlistContainer) return;

    // Carga a modo de ejemplo
    const playlists = [
        { title: 'Mi Playlist 1', image: 'https://via.placeholder.com/150' },
        { title: 'Mi Playlist 2', image: 'https://via.placeholder.com/150' },
        { title: 'Mi Playlist 3', image: 'https://via.placeholder.com/150' },
        { title: 'Mi Playlist 4', image: 'https://via.placeholder.com/150' },
    ];

    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('item');
        playlistElement.innerHTML = `
            <img src="${playlist.image}" alt="${playlist.title}">
            <p>${playlist.title}</p>
        `;
        playlistContainer.appendChild(playlistElement);
    });
}

function loadAlbums() {
    const albumContainer = document.querySelector('.album-grid');
    if (!albumContainer) return;

    // Carga a modo de ejemplo
    const albums = [
        { title: 'Álbum 1', artist: 'Artista 1', image: 'https://via.placeholder.com/150' },
        { title: 'Álbum 2', artist: 'Artista 2', image: 'https://via.placeholder.com/150' },
        { title: 'Álbum 3', artist: 'Artista 3', image: 'https://via.placeholder.com/150' },
        { title: 'Álbum 4', artist: 'Artista 4', image: 'https://via.placeholder.com/150' },
    ];

    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('item');
        albumElement.innerHTML = `
            <img src="${album.image}" alt="${album.title}">
            <p>${album.title}</p>
            <p class="artist">${album.artist}</p>
        `;
        albumContainer.appendChild(albumElement);
    });
}

function loadArtists() {
    const artistContainer = document.querySelector('.artist-grid');
    if (!artistContainer) return;

    // Carga a modo de ejemplo
    const artists = [
        { name: 'Artista 1', image: 'https://via.placeholder.com/150' },
        { name: 'Artista 2', image: 'https://via.placeholder.com/150' },
        { name: 'Artista 3', image: 'https://via.placeholder.com/150' },
        { name: 'Artista 4', image: 'https://via.placeholder.com/150' },
    ];

    artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.classList.add('item');
        artistElement.innerHTML = `
            <img src="${artist.image}" alt="${artist.name}">
            <p>${artist.name}</p>
        `;
        artistContainer.appendChild(artistElement);
    });
}

function loadFavorites() {
    const favoriteContainer = document.querySelector('.favorite-grid');
    if (!favoriteContainer) return;

    // Carga a modo ejemplo
    const favorites = [
        { id: 1, title: 'Canción Favorita 1', artist: 'Artista 1', image: 'https://via.placeholder.com/120', isFavorite: true },
        { id: 2, title: 'Canción Favorita 2', artist: 'Artista 2', image: 'https://via.placeholder.com/120', isFavorite: true },
        { id: 3, title: 'Canción Favorita 3', artist: 'Artista 3', image: 'https://via.placeholder.com/120', isFavorite: true },
        { id: 4, title: 'Canción Favorita 4', artist: 'Artista 4', image: 'https://via.placeholder.com/120', isFavorite: true },
        { id: 5, title: 'Canción Favorita 5', artist: 'Artista 5', image: 'https://via.placeholder.com/120', isFavorite: true },
        { id: 6, title: 'Canción Favorita 6', artist: 'Artista 6', image: 'https://via.placeholder.com/120', isFavorite: true },
    ];

    favorites.forEach(favorite => {
        const favoriteElement = document.createElement('div');
        favoriteElement.classList.add('item');
        favoriteElement.innerHTML = `
            <img src="${favorite.image}" alt="${favorite.title}">
            <p>${favorite.title}</p>
            <p class="artist">${favorite.artist}</p>
        `;
        favoriteElement.addEventListener('click', () => showSongDetails(favorite));
        favoriteContainer.appendChild(favoriteElement);
    });
}

function toggleFavorite(songId) {
    // Aquí irá la lógica para añadir o quitar la canción de favoritos
    const favoriteButton = document.querySelector('.btn-favorite');
    favoriteButton.classList.toggle('active');
    favoriteButton.textContent = favoriteButton.classList.contains('active') ? 'Quitar de favoritos' : 'Añadir a favoritos';
}

function showSongDetails(song) {
    const sidebar = document.getElementById('song-details-sidebar');
    // Carga a modo de ejemplo
    sidebar.innerHTML = `
        <button class="close-sidebar" onclick="closeSongDetails()">×</button>
        <img src="${song.image}" alt="${song.title}">
        <h2>${song.title}</h2>
        <p>Artista: ${song.artist}</p>
        <p>Álbum: Nombre del Álbum</p>
        <p>Año: 2023</p>
        <p>Género: Pop</p>
        <button class="btn-favorite ${song.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${song.id})">
            ${song.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        </button>
    `;
    sidebar.classList.add('active');
    adjustSidebarForMobile();
}

function closeSongDetails() {
    const sidebar = document.getElementById('song-details-sidebar');
    sidebar.classList.remove('active');
}

function adjustLayoutForMobile() {
    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const user = document.querySelector('.user');

    if (window.innerWidth <= 768) {
        main.style.paddingTop = `${nav.offsetHeight + 10}px`;
        main.style.paddingBottom = `${footer.offsetHeight + user.offsetHeight + 15}px`;
        
        const footerRect = footer.getBoundingClientRect();
        user.style.bottom = `${window.innerHeight - footerRect.top + 5}px`;
    } else {
        main.style.paddingTop = '';
        main.style.paddingBottom = '';
        user.style.bottom = '';
    }
}


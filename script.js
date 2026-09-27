/* =========================================================
   AURAPLAY MUSIC PLAYER
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   SONGS
========================================================= */

const songs = [

    {
        title: "Aarzu",
        artist: "Asim Azhar",
        file: "music/Aarzu by asim azhar.mp4",
        image: "images/aarzu.jpg"
    },

    {
        title: "Iraaday",
        artist: "Abdul Hannan, Rovalio",
        file: "music/Abdul Hannan & Rovalio - Iraaday.mp4",
        image: "images/iraaday.jpg"
    },

    {
        title: "Humdum",
        artist: "Aditya Rikhari",
        file: "music/Aditya Rikhari - Humdum.mp4",
        image: "images/humdum.jpg"
    },

    {
        title: "Tu Hai Wohi",
        artist: "Asim Azhar",
        file: "music/Asim Azhar - Tu Hai Wohi.m4a.mp4",
        image: "images/tu-hai-wohi.jpg"
    },

    {
        title: "Finding Her",
        artist: "Kushagra",
        file: "music/Finding Her.mp4",
        image: "images/finding-her.jpg"
    },

    {
        title: "KASHISH",
        artist: "KASHISH",
        file: "music/KASHISH.m4a.mp4",
        image: "images/kashish.jpg"
    },

    {
        title: "Khat",
        artist: "Khat",
        file: "music/Khat (Audio Version).mp4",
        image: "images/khat.jpg"
    },

    {
        title: "The Last Letter",
        artist: "Maan Panu",
        file: "music/Maan Panu - The Last Letter.mp4",
        image: "images/last-letter.jpg"
    },

    {
        title: "Humm",
        artist: "Murtaza Qizilbash",
        file: "music/Murtaza Qizilbash-Hum.mp4",
        image: "images/humm.jpg"
    },

    {
        title: "Sitaare",
        artist: "Sitaare",
        file: "music/Sitaare.mp4",
        image: "images/sitaare.jpg"
    },

    {
        title: "Zaroor",
        artist: "Zaroor",
        file: "music/Zaroor.mp4",
        image: "images/zaroor.jpg"
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const audio = document.getElementById("audioPlayer");

const playlist = document.getElementById("playlist");

const songTitle = document.getElementById("songTitle");

const artistName = document.getElementById("artistName");

const albumImage = document.getElementById("albumImage");

const bottomSong = document.getElementById("bottomSong");

const bottomArtist = document.getElementById("bottomArtist");

const bottomAlbumImage =
    document.getElementById("bottomAlbumImage");

const playButton =
    document.getElementById("playButton");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const shuffleButton =
    document.getElementById("shuffleButton");

const repeatButton =
    document.getElementById("repeatButton");

const favoriteButton =
    document.getElementById("favoriteButton");

const bottomFavoriteButton =
    document.getElementById("bottomFavoriteButton");

const progressBar =
    document.getElementById("progressBar");

const bottomProgressBar =
    document.getElementById("bottomProgressBar");

const volumeBar =
    document.getElementById("volumeBar");

const volumeButton =
    document.getElementById("volumeButton");

const volumeValue =
    document.getElementById("volumeValue");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const bottomCurrentTime =
    document.getElementById("bottomCurrentTime");

const bottomDuration =
    document.getElementById("bottomDuration");

const visualizer =
    document.getElementById("visualizer");

const record =
    document.getElementById("record");

const searchInput =
    document.getElementById("searchInput");

const autoplayToggle =
    document.getElementById("autoplayToggle");

const songCount =
    document.getElementById("songCount");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const playlistTitleText =
    document.getElementById("playlistTitleText");

const playlistIcon =
    document.getElementById("playlistIcon");

const navIndicator =
    document.getElementById("navIndicator");

const fullscreenButton =
    document.getElementById("fullscreenButton");


/* =========================================================
   STATE
========================================================= */

let currentIndex = 0;

let isPlaying = false;

let isShuffle = false;

let isRepeat = false;

let lastVolume = 80;


/* =========================================================
   FAVORITES
========================================================= */

let favorites = [];

try {

    const savedFavorites =
        JSON.parse(
            localStorage.getItem(
                "auraplay-favorites"
            ) || "[]"
        );

    if (Array.isArray(savedFavorites)) {
        favorites = savedFavorites;
    }

} catch (error) {

    favorites = [];

}


/* =========================================================
   NAVIGATION VIEWS
========================================================= */

const navViews = [

    {
        title: "Home",
        icon: "fa-solid fa-house"
    },

    {
        title: "Playlist",
        icon: "fa-solid fa-music"
    },

    {
        title: "Favorites",
        icon: "fa-solid fa-heart"
    }

];


/* =========================================================
   REAL AUDIO VISUALIZER
========================================================= */

let audioContext = null;

let analyser = null;

let audioSourceNode = null;

let frequencyData = null;

let waveFrame = null;


/* =========================================================
   INITIALIZE AUDIO ANALYZER
========================================================= */

function initAudioAnalyzer() {

    if (audioContext) {
        return true;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {

        console.warn(
            "Web Audio API is not supported."
        );

        return false;
    }

    try {

        audioContext =
            new AudioContextClass();

        analyser =
            audioContext.createAnalyser();

        /*
         * 256 gives enough frequency detail
         * without making the animation heavy.
         */

        analyser.fftSize = 256;

        analyser.smoothingTimeConstant = 0.78;

        audioSourceNode =
            audioContext.createMediaElementSource(
                audio
            );

        audioSourceNode.connect(
            analyser
        );

        analyser.connect(
            audioContext.destination
        );

        frequencyData =
            new Uint8Array(
                analyser.frequencyBinCount
            );

        return true;

    } catch (error) {

        console.warn(
            "Audio analyzer could not initialize:",
            error
        );

        audioContext = null;

        analyser = null;

        return false;
    }

}


/* =========================================================
   AUDIO WAVE ANIMATION
========================================================= */

function animateAudioWave() {

    if (
        !analyser ||
        !frequencyData ||
        !record
    ) {

        return;
    }

    analyser.getByteFrequencyData(
        frequencyData
    );

    const bars =
        record.querySelectorAll(
            "span"
        );

    if (!bars.length) {
        return;
    }

    const barCount =
        bars.length;

    bars.forEach(
        (bar, index) => {

            /*
             * Distribute bars through the
             * useful frequency spectrum.
             */

            const start =
                Math.floor(
                    Math.pow(
                        index / barCount,
                        1.65
                    ) *
                    (frequencyData.length - 1)
                );

            const end =
                Math.max(
                    start + 1,

                    Math.floor(
                        Math.pow(
                            (index + 1) /
                            barCount,
                            1.65
                        ) *
                        frequencyData.length
                    )
                );

            let total = 0;

            for (
                let i = start;
                i < end;
                i++
            ) {

                total +=
                    frequencyData[i];

            }

            const average =
                total /
                Math.max(
                    1,
                    end - start
                );

            const normalized =
                average / 255;

            /*
             * Give the bars a minimum height
             * so the wave never disappears.
             */

            const scale =
                Math.min(
                    1.25,
                    0.25 +
                    normalized * 1.15
                );

            bar.style.setProperty(
                "--wave-scale",
                scale.toFixed(3)
            );

            /*
             * Actual audio-reactive opacity.
             */

            bar.style.opacity =
                (
                    0.38 +
                    normalized * 0.62
                ).toFixed(2);

        }
    );

    waveFrame =
        requestAnimationFrame(
            animateAudioWave
        );

}


/* =========================================================
   START AUDIO WAVE
========================================================= */

function startAudioWave() {

    if (
        !analyser ||
        !frequencyData
    ) {

        return;
    }

    cancelAnimationFrame(
        waveFrame
    );

    animateAudioWave();

}


/* =========================================================
   STOP AUDIO WAVE
========================================================= */

function stopAudioWave() {

    cancelAnimationFrame(
        waveFrame
    );

    waveFrame = null;

    if (!record) {
        return;
    }

    const bars =
        record.querySelectorAll(
            "span"
        );

    bars.forEach(
        bar => {

            bar.style.setProperty(
                "--wave-scale",
                ".30"
            );

            bar.style.opacity =
                ".30";

        }
    );

}


/* =========================================================
   PROGRESS FILL
========================================================= */

function setProgressFill(
    slider,
    percentage
) {

    if (!slider) {
        return;
    }

    const value =
        Math.max(
            0,
            Math.min(
                100,
                Number(percentage) || 0
            )
        );

    slider.style.setProperty(
        "--value",
        `${value}%`
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializePlayer() {

    if (!audio) {
        console.error(
            "Audio player element not found."
        );
        return;
    }

    audio.volume = 0.8;

    if (volumeBar) {

        volumeBar.value = 80;

        setProgressFill(
            volumeBar,
            80
        );

    }

    updateVolumeIcon();

    loadSong(0);

    renderHome();

}


/* =========================================================
   LOAD SONG
========================================================= */

function loadSong(index) {

    stopAudioWave();

    stopAnimation();

    isPlaying = false;

    if (index < 0) {

        index =
            songs.length - 1;

    }

    if (
        index >= songs.length
    ) {

        index = 0;

    }

    currentIndex = index;

    const song =
        songs[currentIndex];

    /*
     * Stop current audio before
     * changing the source.
     */

    audio.pause();

    audio.src =
        encodeURI(
            song.file
        );

    audio.load();

    /*
     * Main player information.
     */

    if (songTitle) {

        songTitle.textContent =
            song.title;

    }

    if (artistName) {

        artistName.textContent =
            song.artist;

    }

    if (albumImage) {

        albumImage.src =
            song.image;

        albumImage.alt =
            `${song.title} album artwork`;

    }

    /*
     * Bottom player.
     */

    if (bottomSong) {

        bottomSong.textContent =
            song.title;

    }

    if (bottomArtist) {

        bottomArtist.textContent =
            song.artist;

    }

    if (bottomAlbumImage) {

        bottomAlbumImage.src =
            song.image;

        bottomAlbumImage.alt =
            `${song.title} album artwork`;

    }

    /*
     * Reset progress.
     */

    if (progressBar) {

        progressBar.value = 0;

        setProgressFill(
            progressBar,
            0
        );

    }

    if (bottomProgressBar) {

        bottomProgressBar.value = 0;

        setProgressFill(
            bottomProgressBar,
            0
        );

    }

    if (currentTime) {

        currentTime.textContent =
            "0:00";

    }

    if (duration) {

        duration.textContent =
            "0:00";

    }

    if (bottomCurrentTime) {

        bottomCurrentTime.textContent =
            "0:00";

    }

    if (bottomDuration) {

        bottomDuration.textContent =
            "0:00";

    }

    updateFavoriteButton();

    updatePlaylist();

    updatePlayButton();

}


/* =========================================================
   PLAY SONG
========================================================= */

async function playSong() {

    if (!audio) {
        return;
    }

    /*
     * Create analyzer after the user
     * interacts with the page.
     */

    const analyzerReady =
        initAudioAnalyzer();

    if (
        analyzerReady &&
        audioContext &&
        audioContext.state === "suspended"
    ) {

        try {

            await audioContext.resume();

        } catch (error) {

            console.warn(
                "AudioContext resume failed:",
                error
            );

        }

    }

    try {

        await audio.play();

        isPlaying = true;

        updatePlayButton();

        startAnimation();

        if (analyzerReady) {

            startAudioWave();

        }

    } catch (error) {

        console.error(
            "Audio play error:",
            error
        );

        isPlaying = false;

        updatePlayButton();

        showMessage(
            "Please check the music path."
        );

    }

}


/* =========================================================
   PAUSE SONG
========================================================= */

function pauseSong() {

    if (!audio) {
        return;
    }

    audio.pause();

    isPlaying = false;

    updatePlayButton();

    stopAnimation();

    stopAudioWave();

}


/* =========================================================
   TOGGLE PLAY
========================================================= */

function togglePlay() {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }

}


/* =========================================================
   NEXT SONG
========================================================= */

function nextSong() {

    let nextIndex;

    if (isShuffle) {

        do {

            nextIndex =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        } while (
            nextIndex === currentIndex &&
            songs.length > 1
        );

    } else {

        nextIndex =
            currentIndex + 1;

        if (
            nextIndex >= songs.length
        ) {

            nextIndex = 0;

        }

    }

    loadSong(nextIndex);

    playSong();

}


/* =========================================================
   PREVIOUS SONG
========================================================= */

function previousSong() {

    /*
     * If current song has already played
     * more than 3 seconds, restart it.
     */

    if (
        audio.currentTime > 3
    ) {

        audio.currentTime = 0;

        return;

    }

    let previousIndex =
        currentIndex - 1;

    if (
        previousIndex < 0
    ) {

        previousIndex =
            songs.length - 1;

    }

    loadSong(
        previousIndex
    );

    playSong();

}


/* =========================================================
   PLAY BUTTON UI
========================================================= */

function updatePlayButton() {

    if (!playButton) {
        return;
    }

    const icon =
        playButton.querySelector(
            "i"
        );

    if (!icon) {
        return;
    }

    if (isPlaying) {

        icon.className =
            "fa-solid fa-pause";

        playButton.title =
            "Pause";

    } else {

        icon.className =
            "fa-solid fa-play";

        playButton.title =
            "Play";

    }

}


/* =========================================================
   AUDIO TIME UPDATE
========================================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        if (
            !audio.duration ||
            isNaN(audio.duration)
        ) {

            return;

        }

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;

        /*
         * Main progress.
         */

        if (progressBar) {

            progressBar.value =
                percentage;

            setProgressFill(
                progressBar,
                percentage
            );

        }

        /*
         * Bottom progress.
         */

        if (bottomProgressBar) {

            bottomProgressBar.value =
                percentage;

            setProgressFill(
                bottomProgressBar,
                percentage
            );

        }

        /*
         * Time labels.
         */

        const current =
            formatTime(
                audio.currentTime
            );

        const total =
            formatTime(
                audio.duration
            );

        if (currentTime) {

            currentTime.textContent =
                current;

        }

        if (duration) {

            duration.textContent =
                total;

        }

        if (bottomCurrentTime) {

            bottomCurrentTime.textContent =
                current;

        }

        if (bottomDuration) {

            bottomDuration.textContent =
                total;

        }

    }
);


/* =========================================================
   LOADED METADATA
========================================================= */

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (!audio.duration) {
            return;
        }

        const total =
            formatTime(
                audio.duration
            );

        if (duration) {

            duration.textContent =
                total;

        }

        if (bottomDuration) {

            bottomDuration.textContent =
                total;

        }

    }
);


/* =========================================================
   SONG ENDED
========================================================= */

audio.addEventListener(
    "ended",
    () => {

        isPlaying = false;

        stopAudioWave();

        stopAnimation();

        if (isRepeat) {

            audio.currentTime = 0;

            playSong();

            return;

        }

        if (
            autoplayToggle &&
            autoplayToggle.checked
        ) {

            nextSong();

            return;

        }

        updatePlayButton();

    }
);


/* =========================================================
   MAIN PROGRESS SEEK
========================================================= */

if (progressBar) {

    progressBar.addEventListener(
        "input",
        () => {

            if (
                !audio.duration
            ) {

                return;

            }

            const newTime =
                (
                    Number(
                        progressBar.value
                    ) / 100
                ) *
                audio.duration;

            audio.currentTime =
                newTime;

            setProgressFill(
                progressBar,
                progressBar.value
            );

            if (bottomProgressBar) {

                bottomProgressBar.value =
                    progressBar.value;

                setProgressFill(
                    bottomProgressBar,
                    progressBar.value
                );

            }

            const formatted =
                formatTime(
                    newTime
                );

            if (currentTime) {

                currentTime.textContent =
                    formatted;

            }

            if (bottomCurrentTime) {

                bottomCurrentTime.textContent =
                    formatted;

            }

        }
    );

}


/* =========================================================
   BOTTOM PROGRESS SEEK
========================================================= */

if (bottomProgressBar) {

    bottomProgressBar.addEventListener(
        "input",
        () => {

            if (
                !audio.duration
            ) {

                return;

            }

            const newTime =
                (
                    Number(
                        bottomProgressBar.value
                    ) / 100
                ) *
                audio.duration;

            audio.currentTime =
                newTime;

            setProgressFill(
                bottomProgressBar,
                bottomProgressBar.value
            );

            if (progressBar) {

                progressBar.value =
                    bottomProgressBar.value;

                setProgressFill(
                    progressBar,
                    progressBar.value
                );

            }

            const formatted =
                formatTime(
                    newTime
                );

            if (currentTime) {

                currentTime.textContent =
                    formatted;

            }

            if (bottomCurrentTime) {

                bottomCurrentTime.textContent =
                    formatted;

            }

        }
    );

}


/* =========================================================
   VOLUME
========================================================= */

if (volumeBar) {

    volumeBar.addEventListener(
        "input",
        () => {

            const value =
                Number(
                    volumeBar.value
                );

            audio.volume =
                value / 100;

            lastVolume =
                value;

            if (volumeValue) {

                volumeValue.textContent =
                    `${value}%`;

            }

            setProgressFill(
                volumeBar,
                value
            );

            updateVolumeIcon();

        }
    );

}


/* =========================================================
   VOLUME MUTE
========================================================= */

if (volumeButton) {

    volumeButton.addEventListener(
        "click",
        () => {

            if (
                audio.volume > 0
            ) {

                lastVolume =
                    Number(
                        volumeBar.value
                    ) || 80;

                audio.volume = 0;

                if (volumeBar) {

                    volumeBar.value = 0;

                    setProgressFill(
                        volumeBar,
                        0
                    );

                }

                if (volumeValue) {

                    volumeValue.textContent =
                        "0%";

                }

            } else {

                audio.volume =
                    lastVolume / 100;

                if (volumeBar) {

                    volumeBar.value =
                        lastVolume;

                    setProgressFill(
                        volumeBar,
                        lastVolume
                    );

                }

                if (volumeValue) {

                    volumeValue.textContent =
                        `${lastVolume}%`;

                }

            }

            updateVolumeIcon();

        }
    );

}


/* =========================================================
   VOLUME ICON
========================================================= */

function updateVolumeIcon() {

    if (!volumeButton) {
        return;
    }

    const icon =
        volumeButton.querySelector(
            "i"
        );

    if (!icon) {
        return;
    }

    if (
        audio.volume === 0
    ) {

        icon.className =
            "fa-solid fa-volume-xmark";

    } else if (
        audio.volume < 0.5
    ) {

        icon.className =
            "fa-solid fa-volume-low";

    } else {

        icon.className =
            "fa-solid fa-volume-high";

    }

}


/* =========================================================
   SHUFFLE
========================================================= */

if (shuffleButton) {

    shuffleButton.addEventListener(
        "click",
        () => {

            isShuffle =
                !isShuffle;

            shuffleButton.classList.toggle(
                "active",
                isShuffle
            );

            showMessage(
                isShuffle
                    ? "Shuffle On"
                    : "Shuffle Off"
            );

        }
    );

}


/* =========================================================
   REPEAT
========================================================= */

if (repeatButton) {

    repeatButton.addEventListener(
        "click",
        () => {

            isRepeat =
                !isRepeat;

            repeatButton.classList.toggle(
                "active",
                isRepeat
            );

            showMessage(
                isRepeat
                    ? "Repeat On"
                    : "Repeat Off"
            );

        }
    );

}


/* =========================================================
   FAVORITE TOGGLE
========================================================= */

function toggleFavorite() {

    const existingIndex =
        favorites.indexOf(
            currentIndex
        );

    if (
        existingIndex === -1
    ) {

        favorites.push(
            currentIndex
        );

        showMessage(
            "Added to Favorites ♥"
        );

    } else {

        favorites.splice(
            existingIndex,
            1
        );

        showMessage(
            "Removed from Favorites"
        );

    }

    saveFavorites();

    updateFavoriteButton();

    /*
     * Refresh Favorites view immediately.
     */

    const activeNavIndex =
        getActiveNavIndex();

    if (
        activeNavIndex === 2
    ) {

        showFavorites();

    }

}


/* =========================================================
   SAVE FAVORITES
========================================================= */

function saveFavorites() {

    try {

        localStorage.setItem(
            "auraplay-favorites",
            JSON.stringify(
                favorites
            )
        );

    } catch (error) {

        console.warn(
            "Could not save favorites:",
            error
        );

    }

}


/* =========================================================
   FAVORITE UI
========================================================= */

function updateFavoriteButton() {

    const isFavorite =
        favorites.includes(
            currentIndex
        );

    /*
     * Main favorite button.
     */

    if (favoriteButton) {

        const icon =
            favoriteButton.querySelector(
                "i"
            );

        favoriteButton.classList.toggle(
            "active",
            isFavorite
        );

        if (icon) {

            icon.className =
                isFavorite
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";

        }

    }

    /*
     * Bottom favorite button.
     */

    if (bottomFavoriteButton) {

        const icon =
            bottomFavoriteButton.querySelector(
                "i"
            );

        bottomFavoriteButton.classList.toggle(
            "active",
            isFavorite
        );

        if (icon) {

            icon.className =
                isFavorite
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";

        }

    }

}


/* =========================================================
   FAVORITE BUTTON EVENTS
========================================================= */

if (favoriteButton) {

    favoriteButton.addEventListener(
        "click",
        toggleFavorite
    );

}

if (bottomFavoriteButton) {

    bottomFavoriteButton.addEventListener(
        "click",
        toggleFavorite
    );

}


/* =========================================================
   HOME VIEW
========================================================= */

function renderHome(
    filteredSongs = songs
) {

    if (!playlist) {
        return;
    }

    playlist.classList.add(
        "grid-mode"
    );

    playlist.innerHTML = "";

    if (songCount) {

        songCount.textContent =
            `${filteredSongs.length} tracks curated for you`;

    }

    filteredSongs.forEach(
        (song, position) => {

            const originalIndex =
                songs.indexOf(
                    song
                );

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "home-card";

            card.dataset.songIndex =
                originalIndex;

            card.style.animationDelay =
                `${position * 45}ms`;

            if (
                originalIndex ===
                currentIndex
            ) {

                card.classList.add(
                    "active"
                );

            }

            card.innerHTML = `

                <div class="home-card-art">

                    <img
                        src="${song.image}"
                        alt="${escapeHTML(song.title)}"
                    >

                    <button
                        type="button"
                        class="home-card-play"
                        title="Play ${escapeHTML(song.title)}"
                    >

                        <i class="fa-solid fa-play"></i>

                    </button>

                    ${
                        position === 0
                            ? `
                                <span class="home-card-badge">
                                    Featured
                                </span>
                              `
                            : ""
                    }

                </div>

                <h3>
                    ${escapeHTML(song.title)}
                </h3>

                <p>
                    ${escapeHTML(song.artist)}
                </p>

            `;

            card.addEventListener(
                "click",
                () => {

                    loadSong(
                        originalIndex
                    );

                    playSong();

                }
            );

            const play =
                card.querySelector(
                    ".home-card-play"
                );

            if (play) {

                play.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        loadSong(
                            originalIndex
                        );

                        playSong();

                    }
                );

            }

            playlist.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   PLAYLIST VIEW
========================================================= */

function renderPlaylist(
    filteredSongs = songs
) {

    if (!playlist) {
        return;
    }

    playlist.classList.remove(
        "grid-mode"
    );

    playlist.innerHTML = "";

    if (songCount) {

        songCount.textContent =
            `${filteredSongs.length} songs`;

    }

    filteredSongs.forEach(
        (song, position) => {

            const originalIndex =
                songs.indexOf(
                    song
                );

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "playlist-item";

            item.dataset.songIndex =
                originalIndex;

            if (
                originalIndex ===
                currentIndex
            ) {

                item.classList.add(
                    "active"
                );

            }

            item.innerHTML = `

                <div class="track-number">
                    ${position + 1}
                </div>

                <div class="track-art">

                    <img
                        src="${song.image}"
                        alt="${escapeHTML(song.title)}"
                    >

                </div>

                <div class="track-copy">

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(song.artist)}
                    </p>

                </div>

                <div class="track-meta">

                    <span class="track-duration">
                        —
                    </span>

                    <div class="playing-bars">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>

                </div>

            `;

            item.addEventListener(
                "click",
                () => {

                    loadSong(
                        originalIndex
                    );

                    playSong();

                }
            );

            playlist.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   UPDATE PLAYLIST ACTIVE STATE
========================================================= */

function updatePlaylist() {

    if (!playlist) {
        return;
    }

    const items =
        playlist.querySelectorAll(
            ".playlist-item, .home-card"
        );

    items.forEach(
        item => {

            const itemIndex =
                Number(
                    item.dataset.songIndex
                );

            item.classList.toggle(
                "active",
                itemIndex === currentIndex
            );

        }
    );

}


/* =========================================================
   FAVORITES VIEW
========================================================= */

function showFavorites() {

    const favoriteSongs =
        favorites
            .map(
                index =>
                    songs[index]
            )
            .filter(
                Boolean
            );

    if (
        favoriteSongs.length === 0
    ) {

        playlist.classList.remove(
            "grid-mode"
        );

        playlist.innerHTML = `

            <div class="empty-favorites">

                <div class="empty-icon">

                    <i class="fa-regular fa-heart"></i>

                </div>

                <h3>
                    No Favorite Songs
                </h3>

                <p>
                    Tap the heart icon to add
                    songs to your favorites.
                </p>

            </div>

        `;

        if (songCount) {

            songCount.textContent =
                "0 songs";

        }

        return;

    }

    renderPlaylist(
        favoriteSongs
    );

    if (songCount) {

        songCount.textContent =
            `${favoriteSongs.length} favorite ${
                favoriteSongs.length === 1
                    ? "song"
                    : "songs"
            }`;

    }

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const activeIndex =
                getActiveNavIndex();

            if (playlistTitleText) {

                playlistTitleText.textContent =
                    query
                        ? "Search"
                        : navViews[
                            activeIndex
                        ]?.title || "Home";

            }

            if (!query) {

                if (
                    activeIndex === 0
                ) {

                    renderHome(
                        songs
                    );

                } else if (
                    activeIndex === 1
                ) {

                    renderPlaylist(
                        songs
                    );

                } else {

                    showFavorites();

                }

                return;

            }

            const filtered =
                songs.filter(
                    song =>

                        song.title
                            .toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        song.artist
                            .toLowerCase()
                            .includes(
                                query
                            )
                );

            renderPlaylist(
                filtered
            );

        }
    );

}


/* =========================================================
   GET ACTIVE NAV INDEX
========================================================= */

function getActiveNavIndex() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    return [
        ...navItems
    ].findIndex(
        item =>
            item.classList.contains(
                "active"
            )
    );

}


/* =========================================================
   VISUAL PLAYING ANIMATION
========================================================= */

function startAnimation() {

    if (visualizer) {

        visualizer.classList.add(
            "playing"
        );

    }

    if (record) {

        record.classList.add(
            "playing"
        );

    }

    if (playButton) {

        playButton.classList.add(
            "playing"
        );

    }

    const albumStage =
        document.querySelector(
            ".album-stage"
        );

    if (albumStage) {

        albumStage.classList.add(
            "playing"
        );

    }

}


/* =========================================================
   STOP VISUAL ANIMATION
========================================================= */

function stopAnimation() {

    if (visualizer) {

        visualizer.classList.remove(
            "playing"
        );

    }

    if (record) {

        record.classList.remove(
            "playing"
        );

    }

    if (playButton) {

        playButton.classList.remove(
            "playing"
        );

    }

    const albumStage =
        document.querySelector(
            ".album-stage"
        );

    if (albumStage) {

        albumStage.classList.remove(
            "playing"
        );

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    seconds
) {

    if (
        !seconds ||
        isNaN(seconds) ||
        seconds < 0
    ) {

        return "0:00";

    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );

    return (
        `${minutes}:` +
        `${remainingSeconds
            .toString()
            .padStart(2, "0")}`
    );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "open"
            );

            mobileOverlay?.classList.add(
                "show"
            );

        }
    );

}

if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


function closeMobileMenu() {

    sidebar?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "show"
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(
    (button, index) => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * Remove active from all.
                 */

                navItems.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );

                /*
                 * Activate selected item.
                 */

                button.classList.add(
                    "active"
                );

                /*
                 * Move animated indicator.
                 */

                moveNavIndicator(
                    button
                );

                /*
                 * Update heading.
                 */

                updateViewHeader(
                    index
                );

                /*
                 * HOME
                 */

                if (
                    index === 0
                ) {

                    renderHome(
                        songs
                    );

                }

                /*
                 * PLAYLIST
                 */

                else if (
                    index === 1
                ) {

                    renderPlaylist(
                        songs
                    );

                }

                /*
                 * FAVORITES
                 */

                else if (
                    index === 2
                ) {

                    showFavorites();

                }

                /*
                 * Close mobile menu.
                 */

                if (
                    window.innerWidth <= 900
                ) {

                    closeMobileMenu();

                }

            }
        );

    }
);


/* =========================================================
   NAV INDICATOR
========================================================= */

function moveNavIndicator(
    button
) {

    if (!navIndicator || !button) {
        return;
    }

    navIndicator.style.transform =
        `translateY(${button.offsetTop}px)`;

    navIndicator.style.height =
        `${button.offsetHeight}px`;

}


window.addEventListener(
    "resize",
    () => {

        const activeNav =
            document.querySelector(
                ".nav-item.active"
            );

        if (activeNav) {

            moveNavIndicator(
                activeNav
            );

        }

    }
);


/* =========================================================
   UPDATE VIEW HEADER
========================================================= */

function updateViewHeader(
    index
) {

    const view =
        navViews[index];

    if (!view) {
        return;
    }

    if (playlistTitleText) {

        playlistTitleText.textContent =
            view.title;

    }

    if (playlistIcon) {

        playlistIcon.className =
            view.icon;

    }

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const tag =
            event.target?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {

            return;

        }

        /*
         * Space = Play/Pause
         */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            togglePlay();

        }

        /*
         * Right Arrow = Next
         */

        if (
            event.code === "ArrowRight"
        ) {

            nextSong();

        }

        /*
         * Left Arrow = Previous
         */

        if (
            event.code === "ArrowLeft"
        ) {

            previousSong();

        }

    }
);


/* =========================================================
   SEARCH "/" SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement !==
                searchInput
        ) {

            event.preventDefault();

            searchInput?.focus();

        }

    }
);


/* =========================================================
   FULLSCREEN
========================================================= */

if (fullscreenButton) {

    fullscreenButton.addEventListener(
        "click",
        () => {

            if (
                !document.fullscreenElement
            ) {

                document.documentElement
                    .requestFullscreen()
                    .catch(
                        () => {

                            showMessage(
                                "Fullscreen not available"
                            );

                        }
                    );

            } else {

                document.exitFullscreen();

            }

        }
    );


    document.addEventListener(
        "fullscreenchange",
        () => {

            const icon =
                fullscreenButton.querySelector(
                    "i"
                );

            if (!icon) {
                return;
            }

            icon.className =
                document.fullscreenElement
                    ? "fa-solid fa-compress"
                    : "fa-solid fa-expand";

        }
    );

}


/* =========================================================
   AUDIO ERROR
========================================================= */

audio.addEventListener(
    "error",
    () => {

        console.error(
            "Could not load audio:",
            songs[currentIndex]?.file
        );

        isPlaying = false;

        stopAnimation();

        stopAudioWave();

        updatePlayButton();

        showMessage(
            `Audio file nahi mil rahi: ${
                songs[currentIndex]?.title || "Unknown"
            }`
        );

    }
);


/* =========================================================
   TOAST MESSAGE
========================================================= */

let toastTimer = null;


function showMessage(
    message
) {

    let toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toast";

        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "25px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "11px 18px";

        toast.style.borderRadius =
            "30px";

        toast.style.background =
            "rgba(5,10,25,.95)";

        toast.style.border =
            "1px solid rgba(255,255,255,.12)";

        toast.style.color =
            "white";

        toast.style.fontSize =
            "11px";

        toast.style.fontFamily =
            "Inter, sans-serif";

        toast.style.pointerEvents =
            "none";

        toast.style.transition =
            "opacity .3s ease";

        document.body.appendChild(
            toast
        );

    }

    toast.textContent =
        message;

    toast.style.opacity =
        "1";

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

            },
            2000
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (playButton) {

    playButton.addEventListener(
        "click",
        togglePlay
    );

}

if (nextButton) {

    nextButton.addEventListener(
        "click",
        nextSong
    );

}

if (previousButton) {

    previousButton.addEventListener(
        "click",
        previousSong
    );

}


/* =========================================================
   INITIALIZE PLAYER
========================================================= */

initializePlayer();


/* =========================================================
   INITIAL NAV INDICATOR
========================================================= */

requestAnimationFrame(
    () => {

        const activeNav =
            document.querySelector(
                ".nav-item.active"
            );

        if (activeNav) {

            moveNavIndicator(
                activeNav
            );

        }

    }
);

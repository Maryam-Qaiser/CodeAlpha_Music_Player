/* =========================================================
   AURAPLAY MUSIC PLAYER
   Local Audio Version
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
   ELEMENTS
========================================================= */

const audio = document.getElementById("audioPlayer");

const playlist = document.getElementById("playlist");

const songTitle = document.getElementById("songTitle");

const artistName = document.getElementById("artistName");

const albumImage = document.getElementById("albumImage");

const bottomSong = document.getElementById("bottomSong");

const playButton = document.getElementById("playButton");

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

const progressBar =
    document.getElementById("progressBar");

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


/* =========================================================
   STATE
========================================================= */

let currentIndex = 0;

let isPlaying = false;

let isShuffle = false;

let isRepeat = false;

let favorites = [];

let lastVolume = 80;


/* =========================================================
   INITIALIZE
========================================================= */

audio.volume = 0.8;

loadSong(0);

renderPlaylist();


/* =========================================================
   LOAD SONG
========================================================= */

function loadSong(index) {

    if (index < 0) {
        index = songs.length - 1;
    }

    if (index >= songs.length) {
        index = 0;
    }

    currentIndex = index;

    const song = songs[currentIndex];

    audio.src = encodeURI(song.file);

    songTitle.textContent = song.title;

    artistName.textContent = song.artist;

    bottomSong.textContent = song.title;

    albumImage.src = song.image;

    albumImage.alt =
        `${song.title} album artwork`;

    updateFavoriteButton();

    updatePlaylist();

    currentTime.textContent = "0:00";

    duration.textContent = "0:00";

    progressBar.value = 0;

}


/* =========================================================
   PLAY
========================================================= */

function playSong() {

    audio.play()
        .then(() => {

            isPlaying = true;

            updatePlayButton();

            startAnimation();

        })
        .catch(error => {

            console.error(
                "Audio play error:",
                error
            );

            showMessage(
                "Song load nahi ho raha. File name check karein."
            );

        });

}


/* =========================================================
   PAUSE
========================================================= */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    updatePlayButton();

    stopAnimation();

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
   NEXT
========================================================= */

function nextSong() {

    if (isShuffle) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (
            randomIndex === currentIndex &&
            songs.length > 1
        );

        currentIndex = randomIndex;

    } else {

        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }

    }

    loadSong(currentIndex);

    playSong();

}


/* =========================================================
   PREVIOUS
========================================================= */

function previousSong() {

    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    loadSong(currentIndex);

    playSong();

}


/* =========================================================
   UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton() {

    const icon =
        playButton.querySelector("i");

    if (isPlaying) {

        icon.className =
            "fa-solid fa-pause";

        playButton.title = "Pause";

    } else {

        icon.className =
            "fa-solid fa-play";

        playButton.title = "Play";

    }

}


/* =========================================================
   AUDIO TIME UPDATE
========================================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }

        const percentage =
            (audio.currentTime /
                audio.duration) * 100;

        progressBar.value =
            percentage;

        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/* =========================================================
   METADATA
========================================================= */

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/* =========================================================
   SONG ENDED
========================================================= */

audio.addEventListener(
    "ended",
    () => {

        if (isRepeat) {

            audio.currentTime = 0;

            playSong();

            return;

        }

        if (autoplayToggle.checked) {

            nextSong();

        } else {

            isPlaying = false;

            updatePlayButton();

            stopAnimation();

        }

    }
);


/* =========================================================
   PROGRESS SEEK
========================================================= */

progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration) {
            return;
        }

        const newTime =
            (progressBar.value / 100) *
            audio.duration;

        audio.currentTime =
            newTime;

    }
);


/* =========================================================
   VOLUME
========================================================= */

volumeBar.addEventListener(
    "input",
    () => {

        const value =
            Number(volumeBar.value);

        audio.volume =
            value / 100;

        lastVolume = value;

        volumeValue.textContent =
            `${value}%`;

        updateVolumeIcon();

    }
);


/* =========================================================
   VOLUME BUTTON
========================================================= */

volumeButton.addEventListener(
    "click",
    () => {

        if (audio.volume > 0) {

            lastVolume =
                Number(volumeBar.value);

            audio.volume = 0;

            volumeBar.value = 0;

            volumeValue.textContent = "0%";

        } else {

            audio.volume =
                lastVolume / 100;

            volumeBar.value =
                lastVolume;

            volumeValue.textContent =
                `${lastVolume}%`;

        }

        updateVolumeIcon();

    }
);


/* =========================================================
   VOLUME ICON
========================================================= */

function updateVolumeIcon() {

    const icon =
        volumeButton.querySelector("i");

    if (audio.volume === 0) {

        icon.className =
            "fa-solid fa-volume-xmark";

    } else if (audio.volume < 0.5) {

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


/* =========================================================
   REPEAT
========================================================= */

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


/* =========================================================
   FAVORITE
========================================================= */
favoriteButton.addEventListener(
    "click",
    () => {

        const index =
            favorites.indexOf(
                currentIndex
            );


        if (index === -1) {

            favorites.push(
                currentIndex
            );

            showMessage(
                "Added to Favorites ♥"
            );

        } else {

            favorites.splice(
                index,
                1
            );

            showMessage(
                "Removed from Favorites"
            );

        }


        updateFavoriteButton();


        /*
         * If Favorites page is currently active,
         * refresh its list immediately.
         */

        const favoritesNav =
            navItems[2];


        if (
            favoritesNav &&
            favoritesNav.classList.contains(
                "active"
            )
        ) {

            showFavorites();

        }

    }
);


/* =========================================================
   FAVORITE UI
========================================================= */

function updateFavoriteButton() {

    const icon =
        favoriteButton.querySelector("i");

    const isFavorite =
        favorites.includes(
            currentIndex
        );

    favoriteButton.classList.toggle(
        "active",
        isFavorite
    );

    if (isFavorite) {

        icon.className =
            "fa-solid fa-heart";

    } else {

        icon.className =
            "fa-regular fa-heart";

    }

}


/* =========================================================
   RENDER PLAYLIST
========================================================= */

function renderPlaylist(
    filteredSongs = songs
) {

    playlist.innerHTML = "";

    songCount.textContent =
        `${filteredSongs.length} songs`;

    filteredSongs.forEach(
        (song) => {

            const originalIndex =
                songs.indexOf(song);

            const item =
                document.createElement("div");

            item.className =
                "playlist-item";

            if (
                originalIndex ===
                currentIndex
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <div class="track-art">

                    <img
                        src="${song.image}"
                        alt="${song.title}">

                </div>


                <div class="track-copy">

                    <h3>
                        ${song.title}
                    </h3>

                    <p>
                        ${song.artist}
                    </p>

                </div>


                <div class="track-meta">

                    <span class="track-duration">
                        ${getKnownDuration(originalIndex)}
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
   UPDATE PLAYLIST
========================================================= */

function updatePlaylist() {

    const items =
        playlist.querySelectorAll(
            ".playlist-item"
        );

    items.forEach(
        (item, index) => {

            item.classList.toggle(
                "active",
                index === currentIndex
            );

        }
    );

}


/* =========================================================
   KNOWN DURATIONS
========================================================= */

function getKnownDuration(index) {

    const durations = [

        "--",
        "--",
        "--",
        "--",
        "--",
        "--",
        "--",
        "--",
        "--",
        "--",
        "--"

    ];

    return durations[index] || "--";

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();

        if (!query) {

            renderPlaylist(
                songs
            );

            return;

        }


        const filtered =
            songs.filter(
                song =>
                    song.title
                        .toLowerCase()
                        .includes(query)
                    ||
                    song.artist
                        .toLowerCase()
                        .includes(query)
            );


        renderPlaylist(
            filtered
        );

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.tagName ===
            "INPUT"
        ) {

            return;

        }


        if (event.code === "Space") {

            event.preventDefault();

            togglePlay();

        }


        if (
            event.code ===
            "ArrowRight"
        ) {

            nextSong();

        }


        if (
            event.code ===
            "ArrowLeft"
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

            searchInput.focus();

        }

    }
);


/* =========================================================
   VISUAL ANIMATION
========================================================= */

function startAnimation() {

    visualizer.classList.add(
        "playing"
    );

    record.classList.add(
        "playing"
    );

}


function stopAnimation() {

    visualizer.classList.remove(
        "playing"
    );

    record.classList.remove(
        "playing"
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
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


    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        mobileOverlay.classList.add(
            "show"
        );

    }
);


mobileOverlay.addEventListener(
    "click",
    closeMobileMenu
);


function closeMobileMenu() {

    sidebar.classList.remove(
        "open"
    );

    mobileOverlay.classList.remove(
        "show"
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

/* =========================================================
   NAVIGATION / PLAYLIST VIEWS
========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach((button, index) => {

    button.addEventListener(
        "click",
        () => {

            navItems.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            /* HOME */

            if (index === 0) {

                renderPlaylist(
                    songs
                );

                songCount.textContent =
                    `${songs.length} songs`;

            }


            /* PLAYLIST */

            else if (index === 1) {

                renderPlaylist(
                    songs
                );

                songCount.textContent =
                    `${songs.length} songs`;

            }


            /* FAVORITES */

            else if (index === 2) {

                showFavorites();

            }


            if (
                window.innerWidth <= 900
            ) {

                closeMobileMenu();

            }

        }
    );

});
/* =========================================================
   SHOW FAVORITES
========================================================= */

function showFavorites() {

    const favoriteSongs =
        favorites.map(
            index => songs[index]
        );


    if (
        favoriteSongs.length === 0
    ) {

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

        songCount.textContent =
            "0 songs";

        return;

    }


    renderPlaylist(
        favoriteSongs
    );

    songCount.textContent =
        `${favoriteSongs.length} favorite ${
            favoriteSongs.length === 1
                ? "song"
                : "songs"
        }`;

}

/* =========================================================
   ERROR HANDLING
========================================================= */

audio.addEventListener(
    "error",
    () => {

        console.error(
            "Could not load:",
            songs[currentIndex].file
        );

        showMessage(
            `Audio file nahi mil rahi: ${songs[currentIndex].title}`
        );

        pauseSong();

    }
);


/* =========================================================
   TOAST MESSAGE
========================================================= */

let toastTimer;

function showMessage(message) {

    let toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id = "toast";

        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "25px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "9999";

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
   BUTTON EVENTS
========================================================= */

playButton.addEventListener(
    "click",
    togglePlay
);


nextButton.addEventListener(
    "click",
    nextSong
);


previousButton.addEventListener(
    "click",
    previousSong
);
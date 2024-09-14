const music = document.getElementById('audio')
const seekBar = document.querySelector('.seek-bar')
const songName = document.querySelector('.music-name')
const artistName = document.querySelector('.artist-name')
const disk = document.querySelector('.disk')
const currentTime = document.querySelector('.current-time')
const musicDuration = document.querySelector('.song-duration')
const playBtn = document.querySelector('.play-btn')
const forwardBtn = document.querySelector('.forward-btn')
const backwardBtn = document.querySelector('.backward-btn')

let currentMusic = 0

// Manejar el botón de play/pause
playBtn.addEventListener('click', () => {
    if (playBtn.classList.contains('pause')) {
        music.play()
    } else {
        music.pause()
    }
    playBtn.classList.toggle('pause')
    disk.classList.toggle('play')
})

// Cargar la canción actual y actualizar la interfaz
const setMusic = (index) => {
    seekBar.value = 0
    let song = songs[index]
    currentMusic = index
    music.src = song.path // Asignar la canción desde el arreglo
    songName.innerHTML = song.name
    artistName.innerHTML = song.artist
    disk.style.backgroundImage = `url('${song.cover}')`

    currentTime.innerHTML = '00:00'

    // Esperar a que se cargue la metadata de la canción para obtener la duración
    music.addEventListener('loadedmetadata', () => {
        seekBar.max = music.duration
        musicDuration.innerHTML = formatTime(music.duration)
    })
}

setMusic(0)

// Formatear el tiempo en minutos y segundos
const formatTime = (time) => {
    let minutes = Math.floor(time / 60)
    let seconds = Math.floor(time % 60)
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
}

// Actualizar la barra de progreso en tiempo real
music.addEventListener('timeupdate', () => {
    seekBar.value = music.currentTime
    currentTime.innerHTML = formatTime(music.currentTime)

    // Si la canción ha terminado, pasar a la siguiente automáticamente
    if (music.currentTime === music.duration) {
        forwardBtn.click()
    }
})

// Permitir al usuario mover el deslizador manualmente
seekBar.addEventListener('input', () => {
    music.currentTime = seekBar.value
})

// Reproducir la música automáticamente al hacer click en siguiente/anterior
const playMusic = () => {
    music.play()
    playBtn.classList.remove('pause')
    disk.classList.add('play')
}

// Cambiar a la siguiente canción
forwardBtn.addEventListener('click', () => {
    if (currentMusic >= songs.length - 1) {
        currentMusic = 0
    } else {
        currentMusic++
    }

    setMusic(currentMusic)
    playMusic()
})

// Cambiar a la canción anterior
backwardBtn.addEventListener('click', () => {
    if (currentMusic <= 0) {
        currentMusic = songs.length - 1
    } else {
        currentMusic--
    }

    setMusic(currentMusic)
    playMusic()
})

// Lista de canciones para el reproductor:
const songListElement = document.getElementById('song-list');

// Generar la lista de canciones
songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerText = song.name;
    li.addEventListener('click', () => {
        setMusic(index); // Reproducir la canción seleccionada
        playMusic(); // Iniciar la reproducción automática
    });
    songListElement.appendChild(li);
});

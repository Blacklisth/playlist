/* ============================================
   CONFIGURATION PERSONNALISABLE
   ============================================ */

const CONFIG = {
    // PLAYLIST - Personnalisez vos chansons ici
    playlist: [
        {
            title: "Perfect",
            artist: "Ed Sheeran",
            duration: "4:23",
            message: "Cette chanson était en fond lors de notre première danse. Chaque note me rappelle ce moment magique.",
            // Pour ajouter un vrai lien audio, utilisez:
            audioUrl: "https://www.youtube.com/watch?v=2Vv-BfVoq4g"
            // ou audioUrl: "chemin/vers/votre/fichier.mp3"
            
        },
        {
            title: "All of Me",
            artist: "John Legend",
            duration: "5:07",
            message: "Les paroles de cette chanson décrivent parfaitement ce que je ressens pour toi. Tu es tout pour moi.",
            audioUrl: "https://www.youtube.com/watch?v=450p7goxZqg&list=RD450p7goxZqg&start_radio=1"
        },
        {
            title: "A Thousand Years",
            artist: "Christina Perri",
            duration: "4:47",
            message: "J'ai attendu mille ans pour te trouver, et je t'attendrais encore mille ans de plus.",
            audioUrl: "https://www.youtube.com/watch?v=rtOvBOTyX00&list=RDrtOvBOTyX00&start_radio=1"
        },
        {
            title: "Thinking Out Loud",
            artist: "Ed Sheeran",
            duration: "4:49",
            message: "Quand tes jambes ne fonctionneront plus, je te porterai. Parce que mon amour pour toi est éternel.",
            audioUrl: "https://www.youtube.com/watch?v=lp-EO5I60KA&list=RDlp-EO5I60KA&start_radio=1"
        },
        {
            title: "Make You Feel My Love",
            artist: "Adele",
            duration: "4:06",
            message: "Je ferais tout pour que tu te sentes aimée, chaque jour de ta vie.",
            audioUrl: "https://www.youtube.com/watch?v=0put0_a--Ng&list=RD0put0_a--Ng&start_radio=1"
        },
        {
            title: "Can't Help Falling in Love",
            artist: "Elvis Presley",
            duration: "3:00",
            message: "Comme une rivière qui coule vers la mer, mon amour coule naturellement vers toi.",
            audioUrl: "https://www.youtube.com/watch?v=vGJTaP6anOU&list=RDvGJTaP6anOU&start_radio=1"
        },
        {
            title: "Your Song",
            artist: "Elton John",
            duration: "3:48",
            message: "Cette chanson est pour toi, parce que tu rends ma vie merveilleuse.",
            audioUrl: "https://www.youtube.com/watch?v=GlPlfCy1urI&list=RDGlPlfCy1urI&start_radio=1"
        },
        {
            title: "At Last",
            artist: "Etta James",
            duration: "3:04",
            message: "Enfin, j'ai trouvé l'amour que je cherchais depuis toujours.",
            audioUrl: "https://www.youtube.com/watch?v=S-cbOl96RFM&list=RDS-cbOl96RFM&start_radio=1"
        }
    ],
    
    // Message final personnalisable
    finalMessage: "Chaque chanson de cette playlist raconte un moment précieux de notre histoire. La musique nous accompagne depuis le premier jour, et continuera de bercer notre amour pour toujours."
};

/* ============================================
   VARIABLES GLOBALES
   ============================================ */

let currentSongIndex = 0;
let isPlaying = false;
let audioPlayer = null;

/* ============================================
   INITIALISATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializePlaylist();
    initializePlayer();
    updateSongCount();
    updateFinalMessage();
});

/* ============================================
   CRÉATION DES PARTICULES
   ============================================ */

function initializeParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        particle.style.left = Math.random() * 100 + '%';
        
        // Taille aléatoire
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Durée d'animation aléatoire
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        // Délai aléatoire
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Offset horizontal aléatoire
        particle.style.setProperty('--x-offset', (Math.random() - 0.5) * 100 + 'px');
        
        container.appendChild(particle);
    }
}

/* ============================================
   GÉNÉRATION DE LA PLAYLIST
   ============================================ */

function initializePlaylist() {
    const container = document.getElementById('playlistContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    CONFIG.playlist.forEach((song, index) => {
        const songItem = createSongItem(song, index);
        container.appendChild(songItem);
    });
}

function createSongItem(song, index) {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.setAttribute('data-index', index);
    
    item.innerHTML = `
        <div class="song-number">${index + 1}</div>
        <div class="song-info">
            <div class="song-info-title">${song.title}</div>
            <div class="song-info-artist">${song.artist}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
    `;
    
    item.addEventListener('click', function() {
        playSong(index);
    });
    
    return item;
}

/* ============================================
   INITIALISATION DU LECTEUR
   ============================================ */

function initializePlayer() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousSong);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSong);
    }
    
    // Charger la première chanson
    loadSong(0);
}

/* ============================================
   CHARGEMENT D'UNE CHANSON
   ============================================ */

function loadSong(index) {
    if (index < 0 || index >= CONFIG.playlist.length) return;
    
    currentSongIndex = index;
    const song = CONFIG.playlist[index];
    
    // Mettre à jour l'affichage
    updateSongDisplay(song);
    updateActiveItem(index);
    
    // Si un fichier audio est disponible
    if (song.audioUrl) {
        audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.src = song.audioUrl;
            audioPlayer.load();
        }
    }
}

function updateSongDisplay(song) {
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const songMessage = document.getElementById('songMessage');
    
    if (songTitle) songTitle.textContent = song.title;
    if (songArtist) songArtist.textContent = song.artist;
    if (songMessage) songMessage.textContent = song.message;
}

function updateActiveItem(index) {
    // Retirer la classe active de tous les items
    const items = document.querySelectorAll('.song-item');
    items.forEach(item => item.classList.remove('active'));
    
    // Ajouter la classe active à l'item sélectionné
    const activeItem = document.querySelector(`[data-index="${index}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        
        // Scroll vers l'item actif
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* ============================================
   CONTRÔLES DE LECTURE
   ============================================ */

function togglePlay() {
    const vinyl = document.querySelector('.vinyl-record');
    const playIcon = document.getElementById('playIcon');
    
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    isPlaying = true;
    
    const vinyl = document.querySelector('.vinyl-record');
    const playIcon = document.getElementById('playIcon');
    
    if (vinyl) vinyl.classList.add('playing');
    if (playIcon) playIcon.textContent = '⏸';
    
    // Si un lecteur audio est disponible
    if (audioPlayer && audioPlayer.src) {
        audioPlayer.play().catch(err => {
            console.log('Impossible de lire l\'audio:', err);
        });
    }
    
    // Animation de la barre de progression (simulation si pas d'audio)
    if (!audioPlayer || !audioPlayer.src) {
        simulateProgress();
    }
}

function pause() {
    isPlaying = false;
    
    const vinyl = document.querySelector('.vinyl-record');
    const playIcon = document.getElementById('playIcon');
    
    if (vinyl) vinyl.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶';
    
    if (audioPlayer) {
        audioPlayer.pause();
    }
}

function playSong(index) {
    loadSong(index);
    play();
}

function previousSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
        newIndex = CONFIG.playlist.length - 1;
    }
    playSong(newIndex);
}

function nextSong() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= CONFIG.playlist.length) {
        newIndex = 0;
    }
    playSong(newIndex);
}

/* ============================================
   SIMULATION DE PROGRESSION (sans audio)
   ============================================ */

let progressInterval;

function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    
    // Récupérer la durée de la chanson actuelle
    const song = CONFIG.playlist[currentSongIndex];
    const durationParts = song.duration.split(':');
    const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    
    if (duration) {
        duration.textContent = song.duration;
    }
    
    let elapsed = 0;
    
    // Nettoyer l'intervalle précédent
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        
        elapsed += 1;
        
        if (elapsed >= totalSeconds) {
            elapsed = 0;
            nextSong();
            return;
        }
        
        const progress = (elapsed / totalSeconds) * 100;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (currentTime) {
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            currentTime.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

/* ============================================
   GESTION DE L'AUDIO RÉEL
   ============================================ */

if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', function() {
        const progressFill = document.getElementById('progressFill');
        const currentTime = document.getElementById('currentTime');
        
        if (this.duration) {
            const progress = (this.currentTime / this.duration) * 100;
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
            
            if (currentTime) {
                const minutes = Math.floor(this.currentTime / 60);
                const seconds = Math.floor(this.currentTime % 60);
                currentTime.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
            }
        }
    });
    
    audioPlayer.addEventListener('loadedmetadata', function() {
        const duration = document.getElementById('duration');
        if (duration) {
            const minutes = Math.floor(this.duration / 60);
            const seconds = Math.floor(this.duration % 60);
            duration.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        nextSong();
    });
}

/* ============================================
   CLIC SUR LA BARRE DE PROGRESSION
   ============================================ */

const progressBar = document.getElementById('progressBar');
if (progressBar) {
    progressBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        // Si audio réel disponible
        if (audioPlayer && audioPlayer.duration) {
            audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
        }
    });
}

/* ============================================
   UTILITAIRES
   ============================================ */

function updateSongCount() {
    const songCount = document.getElementById('songCount');
    if (songCount) {
        songCount.textContent = CONFIG.playlist.length;
    }
}

function updateFinalMessage() {
    const finalMessage = document.getElementById('finalMessage');
    if (finalMessage) {
        finalMessage.textContent = CONFIG.finalMessage;
    }
}

/* ============================================
   RACCOURCIS CLAVIER
   ============================================ */

document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case ' ':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSong();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSong();
            break;
    }
});

/* ============================================
   EASTER EGG - Double clic sur le vinyle
   ============================================ */

document.querySelector('.vinyl-record')?.addEventListener('dblclick', function() {
    // Créer des cœurs qui sortent du vinyle
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        
        const rect = this.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + rect.height / 2 + 'px';
        heart.style.fontSize = '30px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        document.body.appendChild(heart);
        
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(360deg)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => heart.remove();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const albumArt = document.getElementById('albumArt');
    const commentText = document.getElementById('commentText');
    const ytIframe = document.getElementById('ytIframe');
    const playOverlay = document.getElementById('playOverlay');
    const controlsGroup = document.getElementById('controlsGroup');
    const controlsSpacer = document.getElementById('controlsSpacer');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let isPlaying = false;
    let progress = 0;
    let currentTrackIndex = 0;
    
    const playlist = [
        {
            title: "Fantasmas - HUMBE",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/WkjqvPDmvRU?si=03HCK4zRrGsdEk60",
            coverSrc: "olivio.png",
            commentText: "Uma música que me causa saudade"
        },
        {
            title: "Super - Jão",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/POHe-f_bfuY?si=1_p0XiQv76Ee70_Z",
            coverSrc: "ed2.jpeg",
            commentText: "Essa aqui me define completamente"
        },
        {
            title: "Travie McCoy: Billionaire ft. Bruno Mars",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/8aRor905cCw?si=VL5MRicHNd36qSKJ",
            coverSrc: "ed.jpeg",
            commentText: "Para escutar sonhando alto"
        }
    ];
    
    const audio = new Audio();
    audio.preload = 'metadata';

    function loadTrack(index) {
        const track = playlist[index];
        
        if (track.iframeSrc) {
            ytIframe.src = track.iframeSrc;
            ytIframe.style.display = 'block';
            if (albumArt) albumArt.style.display = 'none';
            if (progressBar) progressBar.style.display = 'none';
            if (playOverlay) playOverlay.style.display = 'none';
            if (controlsGroup) {
                controlsGroup.style.display = 'flex';
                controlsGroup.style.justifyContent = 'space-between';
                controlsGroup.style.padding = '0 10px';
            }
            if (controlsSpacer) controlsSpacer.style.display = 'none';
            if (playBtn) playBtn.style.display = 'none';
            audio.pause();
            isPlaying = false;
        } else {
            ytIframe.src = '';
            ytIframe.style.display = 'none';
            if (albumArt) albumArt.style.display = 'block';
            if (progressBar) progressBar.style.display = 'block';
            if (playOverlay) {
                playOverlay.style.display = 'flex';
                playOverlay.style.background = 'rgba(0,0,0,0.1)';
            }
            if (controlsGroup) {
                controlsGroup.style.display = 'flex';
                controlsGroup.style.justifyContent = 'center';
                controlsGroup.style.padding = '0';
            }
            if (controlsSpacer) controlsSpacer.style.display = 'block';
            if (playBtn) playBtn.style.display = 'flex';
            
            if (!audio.src.includes(track.audioSrc)) {
                audio.src = track.audioSrc;
                audio.load();
            }
        }
        
        if (albumArt) albumArt.src = track.coverSrc;
        if (trackTitle) trackTitle.textContent = track.title;
        if (trackArtist) trackArtist.textContent = track.artist;
        if (commentText && track.commentText) commentText.textContent = track.commentText;
        
        progress = 0;
        updateProgressUI();
        
        if (isPlaying && !track.iframeSrc) {
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Playback prevented:', error));
            }
        }
    }
    
    function updateProgressUI() {
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    function togglePlay(e) {
        if (e && e.target.closest('.yt-control-btn')) return;
        if (playlist[currentTrackIndex].iframeSrc) return;

        isPlaying = !isPlaying;
        
        if (isPlaying) {
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = 'block';
            
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Playback prevented:', error));
            }
            if (playOverlay) playOverlay.style.background = 'transparent';
        } else {
            if (iconPlay) iconPlay.style.display = 'block';
            if (iconPause) iconPause.style.display = 'none';
            audio.pause();
            if (playOverlay) playOverlay.style.background = 'rgba(0,0,0,0.1)';
        }
    }
    
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progress = (audio.currentTime / audio.duration) * 100;
            updateProgressUI();
        }
    });

    function playNext() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (!isPlaying) togglePlay(); 
    }

    function playPrev() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (!isPlaying) togglePlay();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playNext();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playPrev();
        });
    }

    audio.addEventListener('ended', () => {
        playNext();
    });

    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (playOverlay) {
        playOverlay.addEventListener('click', (e) => {
            if (!e.target.closest('.yt-control-btn') && !e.target.closest('#playBtn')) {
                togglePlay(e);
            }
        });
    }

    // Click on progress bar to seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            progress = (clickX / rect.width) * 100;
            
            if (audio.duration) {
                audio.currentTime = (progress / 100) * audio.duration;
            }
            
            updateProgressUI();
        });
    }

    // Init
    loadTrack(0);


    // Services Data
    const services = [
        {
            title: "UX/UI Design",
            description: "Criação de interfaces intuitivas e esteticamente agradáveis, focadas na melhor experiência do usuário."
        },
        {
            title: "Product Strategy",
            description: "Alinhamento entre visão de negócios e necessidades reais do usuário para criar produtos viáveis."
        },
        {
            title: "Design System",
            description: "Construção de bibliotecas escaláveis de componentes para manter a consistência visual do produto."
        },
        {
            title: "Auditoria Visual",
            description: "Análise criteriosa de interfaces existentes para identificar gargalos de usabilidade e melhorias."
        }
    ];

    function renderServices() {
        const container = document.getElementById('cardsContainer');
        if (!container) return;

        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="/carta.webp" alt="Carta Misteriosa">
                    </div>
                    <div class="card-back">
                        <h4>${service.title}</h4>
                        <p>${service.description}</p>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                if (card.classList.contains('is-flipped')) {
                    card.classList.remove('is-flipped');
                } else {
                    document.querySelectorAll('.card.is-flipped').forEach(c => {
                        c.classList.remove('is-flipped');
                    });
                    card.classList.add('is-flipped');
                }
            });

            container.appendChild(card);
        });
    }

    renderServices();
});

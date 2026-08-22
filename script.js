document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressKnob = document.getElementById('progressKnob');
    const timeCurrent = document.getElementById('timeCurrent');
    
    let isPlaying = false;
    let progress = 0; // initial percentage
    let timeSeconds = 0; // 0:00 initial time
    
    // Setup Audio
    const audio = new Audio('/super.mp3');
    audio.preload = 'none'; // Impede que o áudio seja baixado antes do usuário dar Play
    
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
            audio.play();
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            audio.pause();
        }
    }
    
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progress = (audio.currentTime / audio.duration) * 100;
            timeSeconds = audio.currentTime;
            updateProgressUI();
        }
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        progress = 0;
        timeSeconds = 0;
        updateProgressUI();
    });

    function updateProgressUI() {
        progressFill.style.width = `${progress}%`;
        progressKnob.style.left = `${progress}%`;
        timeCurrent.textContent = formatTime(timeSeconds);
    }

    playBtn.addEventListener('click', togglePlay);

    // Click on progress bar to seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        progress = (clickX / rect.width) * 100;
        
        if (audio.duration) {
            audio.currentTime = (progress / 100) * audio.duration;
            timeSeconds = audio.currentTime;
        }
        
        updateProgressUI();
    });
});

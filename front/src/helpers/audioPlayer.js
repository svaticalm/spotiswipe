class AudioPlayer {
    constructor(elem, url) {
        this.audioPlayer = elem;
        this.audio = new Audio(url);
    }

    init = () => {
        // Подгрузка плеера
        this.audio.addEventListener(
            'loadeddata',
            () => {
                this.audioPlayer.querySelector('.length').textContent = this.getTimeCodeFromNum(this.audio.duration);
                this.audio.volume = 1;
            },
            false,
        );

        // Переход по клику на таймлайн
        const timeline = this.audioPlayer.querySelector('.timeline');
        timeline.addEventListener('click', (e) => {
            const timelineWidth = window.getComputedStyle(timeline).width;
            const timeToSeek = (e.offsetX / parseInt(timelineWidth, 10)) * this.audio.duration;
            this.audio.currentTime = timeToSeek;
        }, false);

        // Прогресс бар
        setInterval(() => {
            const progressBar = this.audioPlayer.querySelector('.progress');
            progressBar.style.width = `${(this.audio.currentTime / this.audio.duration) * 100}%`;
            this.audioPlayer.querySelector('.current').textContent = this.getTimeCodeFromNum(this.audio.currentTime);
        }, 500);

        // Плей / Пауза
        this.playBtn = this.audioPlayer.querySelector('.toggle-play');

        this.playBtn.addEventListener(
            'click',
            () => {
                if (this.audio.paused) {
                    this.playAudio();
                } else {
                    this.pauseAudio();
                }
            },
            false,
        );
    }

    getTimeCodeFromNum = (num) => {
        let seconds = parseInt(num, 10);
        let minutes = parseInt(seconds / 60, 10);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60, 10);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    }

    playAudio = () => {
        this.playBtn.classList.add('pause');
        this.playBtn.classList.remove('play');
        this.audio.play();
    }

    pauseAudio = () => {
        this.playBtn.classList.remove('pause');
        this.playBtn.classList.add('play');
        this.audio.pause();
    }
}

export default AudioPlayer;

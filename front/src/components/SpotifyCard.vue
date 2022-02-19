<template>
    <div class="cards__item" ref="cardElem">
        <div class="cards__item-choice --reject">
            <div class="icon-wrapper reject">
                <div class="icon"></div>
            </div>
        </div>
        <div class="cards__item-choice --like">
            <div class="icon-wrapper reject">
                <div class="icon"></div>
            </div>
        </div>
        <div class="cards__item-image"
            :style="{backgroundImage: `url(${card.track.album.images[0].url})`}">
        </div>
        <div class="audio-player">
            <div class="timeline">
                <div class="progress"></div>
            </div>
            <div class="time">
                <div class="current">0:00</div>
                <div class="length"></div>
            </div>
            <div class="controls">
                <div class="play-container">
                    <div class="toggle-play play">
                    </div>
                </div>
            </div>
        </div>
        <div class="cards__item-info">
            <div class="cards__item-name">
                {{card.track.name}}
            </div>
            <div class="cards__item-author">
                <span class="" v-for="(artist, index) in card.track.artists" :key="artist.id">
                    <span v-if="index !== 0">, </span>{{artist.name}}
                </span>
            </div>
        </div>

    </div>
</template>

<script>
import AudioPlayer from '@/helpers/audioPlayer';

export default {
    name: 'SpotifyCard',
    components: {},
    props: {
        card: {},
        swipedCards: Number,
        index: Number,
    },
    data() {
        return {
            audioPlayer: false,
        };
    },
    computed() {
    },
    methods: {
    },
    watch: {
        swipedCards(val) {
            if (val - 1 === this.index) {
                this.audioPlayer.pauseAudio();
            } else if (val === this.index) {
                this.audioPlayer.playAudio();
            }
        },
    },
    created() {
    },
    beforeUnmount() {
        this.audioPlayer.pauseAudio();
    },
    mounted() {
        this.audioPlayer = new AudioPlayer(this.$refs.cardElem, this.card.track.preview_url);
        this.audioPlayer.init();
    },
};
</script>

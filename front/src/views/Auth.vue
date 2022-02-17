<template>
    <div class="content" v-if="playlist">
        <div class="circle"></div>
        <div class="df df--space-between">
            <div class="logo">
                Spotiswipe
            </div>
            <div class="setting-btn"></div>
        </div>
        <spotify-cards :tracks="playlist.tracks.items"></spotify-cards>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SpotifyCards from '@/components/SpotifyCards.vue';

export default {
    name: 'Home',
    components: {
        SpotifyCards,
    },
    computed: mapState({
        token: (state) => state.api.token,
        playlist: (state) => state.api.playlist,
    }),
    methods: {
        checkToken() {
            return localStorage.getItem('token') !== 'false' && localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== '';
        },
    },
    mounted() {
        this.$store.dispatch('api/getToken', this.$route.fullPath);
    },
};
</script>

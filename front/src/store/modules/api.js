// import { jsonHeader } from '@/helpers/axiosHeaders';
import axios from 'axios';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */
// import router from '../../router';

const state = {
    token: null,
    playlist: false,
    clientId: '99abd32428d849b9b7734dde13eb2b98',
    clientSecret: '6795bb699bc54ba3b2f150464388c6fc',
    redirectUri: process.env.VUE_APP_PATH_FRONT,
};

const mutations = {
    SET_TOKEN(state, data) {
        state.token = data;
    },
    SET_PLAYLIST(state, data) {
        state.playlist = data;
    },
};

const actions = {
    getToken({ commit, dispatch, state }, data) {
        const hash = decodeURI(data).replace(/"/g, '"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"')
            .replace('/#', '')
            .replace('/', '');
        const parsedHash = hash ? JSON.parse(`{"${hash}"}`) : false;
        if (!parsedHash.access_token) {
            window.open(`https://accounts.spotify.com/ru/authorize?client_id=${state.clientId}&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify%20user-library-read%20user-library-modify%20user-read-email%20user-read-private%20streaming%20user-top-read&response_type=token&redirect_uri=${state.redirectUri}&client_secret=${state.clientSecret}`, '_self');
        } else {
            localStorage.setItem('token', parsedHash.access_token);
            commit('SET_TOKEN', parsedHash.access_token);
            dispatch('getPlaylist', '08PVFRcL8Isdh9cW1fbflo');
        }
    },
    getPlaylist({ commit, state }, data) {
        return new Promise((resolve) => {
            const playlistId = data;
            axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': ' application/json',
                    Authorization: `Bearer ${state.token}`,
                },
            }).then((response) => {
                commit('SET_PLAYLIST', response.data);
                resolve();
            }).catch(() => {
                resolve();
            });
        });
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};

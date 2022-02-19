import axios from 'axios';
import baseImage from '@/helpers/baseImage';
// import initAudioPlayer from '@/helpers/audioPlayer';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */
// import router from '../../router';

const state = {
    token: null,
    playlist: false,
    clientId: '99abd32428d849b9b7734dde13eb2b98',
    clientSecret: '6795bb699bc54ba3b2f150464388c6fc',
    redirectUri: process.env.VUE_APP_PATH_FRONT,
    user: false,
    userId: false,
    ourPlaylist: false,
    refresh_token: false,
};

const mutations = {
    SET_TOKEN(state, data) {
        state.token = data;
    },
    SET_PLAYLIST(state, data) {
        state.playlist = data;
    },
    SET_USER(state, data) {
        state.user = data;
        state.userId = data.id;
    },
    SET_REFRESH_TOKEN(state, data) {
        state.refresh_token = data;
    },
    SET_OUR_PLAYLIST(state, data) {
        state.ourPlaylist = data;
    },
};

const actions = {
    refreshAuthToken({ state, commit, dispatch }, callback) {
        return new Promise((resolve) => {
            axios.post('https://accounts.spotify.com/api/token', { grant_type: 'refresh_token', refresh_token: state.refresh_token }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${state.token}`,
                },
            }).then((response) => {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                commit('SET_TOKEN', response.data.access_token);
                commit('SET_REFRESH_TOKEN', response.data.refresh_token);
                dispatch(callback);
                resolve();
            }).catch(() => {
                resolve();
            });
        });
    },
    getToken({ commit, dispatch, state }, data) {
        const hash = decodeURI(data).replace(/"/g, '"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"')
            .replace('/#', '')
            .replace('/', '');
        const parsedHash = hash ? JSON.parse(`{"${hash}"}`) : false;
        if (!parsedHash.access_token) {
            const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-read user-follow-modify user-library-read user-library-modify user-read-email user-read-private streaming user-top-read';
            window.open(`https://accounts.spotify.com/ru/authorize?client_id=${state.clientId}&scope=${scope}&response_type=token&redirect_uri=${state.redirectUri}&client_secret=${state.clientSecret}`, '_self');
        } else {
            localStorage.setItem('token', parsedHash.access_token);
            localStorage.setItem('refresh_token', parsedHash.refresh_token);
            commit('SET_TOKEN', parsedHash.access_token);
            commit('SET_REFRESH_TOKEN', parsedHash.refresh_token);
            dispatch('getPlaylist', '37i9dQZF1EIVoL7KX5VFBd?si=7975e607eba9474f');
            dispatch('getUser').then(() => {
                if (!localStorage.getItem('ourPlaylist')) {
                    dispatch('createPlaylist');
                }
            });
        }
    },
    getUser({ commit, state }) {
        return new Promise((resolve) => {
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': ' application/json',
                    Authorization: `Bearer ${state.token}`,
                },
            }).then((response) => {
                commit('SET_USER', response.data);
                resolve();
            }).catch(() => {
                resolve();
            });
        });
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
    createPlaylist({ commit, state, dispatch }) {
        return new Promise((resolve) => {
            axios.post(`https://api.spotify.com/v1/users/${state.userId}/playlists`, { name: 'Понравившиеся Spotiswipe', description: 'Мы собрали все треки, которые тебе понравились в нашем приложении, с любовь, Spotiswipe', public: false }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': ' application/json',
                    Authorization: `Bearer ${state.token}`,
                },
            }).then((response) => {
                commit('SET_OUR_PLAYLIST', response.data.id);
                localStorage.setItem('ourPlaylist', response.data.id);
                dispatch('addPlaylistImage');
                resolve();
            }).catch(() => {
                resolve();
            });
        });
    },
    addPlaylistImage({ state, dispatch }) {
        return new Promise((resolve) => {
            axios.put(`https://api.spotify.com/v1/playlists/${state.ourPlaylist}/images`, { body: baseImage }, {
                headers: {
                    Authorization: `Bearer ${state.token}`,
                    'Content-Type': 'image/jpeg',
                },
            }).then(() => {
                resolve();
            }).catch(() => {
                dispatch('refreshAuthToken', 'addPlaylistImage');
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

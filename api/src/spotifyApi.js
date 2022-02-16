// const SpotifyWebApi = require('spotify-web-api-node');
const open = require('open');
const axios = require('axios');

const clientId = '99abd32428d849b9b7734dde13eb2b98';
const clientSecret = '6795bb699bc54ba3b2f150464388c6fc';
const redirectUri = 'http://localhost:8080/';

// // credentials are optional
// const spotifyApi = new SpotifyWebApi({
//     clientId,
//     clientSecret,
//     redirectUri,
// });

open(`https://accounts.spotify.com/ru/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&client_secret=${clientSecret}`);

const fetchData = async () => {
    let response;

    try {
        response = await axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params: {
                grant_type: 'client_credentials',
                redirect_uri: redirectUri,
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: clientId,
                password: clientSecret,
            },
        });
    } catch (e) {
        throw new Error(e.message);
    }

    return response?.data ? response?.data : null;
};

module.exports.fetchData = fetchData;

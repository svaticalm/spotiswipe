const http = require('http');
const express = require('express');
const { fetchData } = require('./spotifyApi');

const app = express();

const { log } = console;

const server = http.createServer((req, res) => {
    res.end('Hello NodeJsS');
});

app.get('/get-token', (req, res) => {
    fetchData().then((response) => {
        res.send(response);
    });
});

server.listen(8081, () => {
    log('213');
});

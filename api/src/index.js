const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:8080' }));
const port = 3000;
const {
    fetchData,
} = require('./spotifyApi');

const { log } = console;

// Получить access_token
app.get('/get-token', (request, response) => {
    // Website you wish to allow to connect
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);
    fetchData().then((res) => {
        response.send(res.access_token);
    });
});

// Запуск сервера
const server = app.listen(port, (error) => {
    if (error) return;
    log(`Server listening on port ${server.address().port}`);
});

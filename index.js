require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, MONGO_PASS } = process.env;

const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const MongoClient = require('mongodb').MongoClient

const app = express();
app.use(express.static(__dirname + '/public/'));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect([
        'https://discordapp.com/oauth2/authorize',
        `?client_id=${CLIENT_ID}`,
        '&scope=identify',
        '&response_type=code',
        `&redirect_uri=${encodeURIComponent('http://localhost:8080/authorize')}`
    ].join(''));
});


MongoClient.connect(`mongodb+srv://dbUser:${MONGO_PASS}@cluster0.2m8ah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(client => {
        const db = client.db('seeds');
        const seeds = db.collection('seeds');

        app.post('/seeds/add', (req, res) => {
            console.log(req.body);
            seeds.insertOne(req.body).then(data => {
                res.json(data);
            });
        });

        app.get('/seeds/get', (req, res) => {
            seeds.find().toArray().then(data => {
                res.json(data);
            });
        });
    });

app.get('/home', (req, res, next) => {
    fetch(
        'https://discordapp.com/api/users/@me',
        {
            headers: {
                Authorization: `Bearer ${req.query.token}`
            }
        }
    ).then(r => r.json()).then(json => {
        res.cookie('username', json.username);
        res.cookie('avatar', json.avatar);
        res.cookie('id', json.id);
        res.sendFile(__dirname + '/public/home.html');
    });
});

app.get('/authorize', (req, res) => {
    const { code } = req.query;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    fetch(
        `https://discordapp.com/api/oauth2/token`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent('http://localhost:8080/authorize')}`
        }
    ).then(res => res.json()).then(json => {
        res.redirect(`/home?token=${json.access_token}`);
    });
});

app.listen(8080, () => console.log('Server up!'));

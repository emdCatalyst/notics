require('dotenv').config();

const Client = require('./src/core/client.js');
const client = new Client();

client.login(process.env.TOKEN);

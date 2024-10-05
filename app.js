// developed by Leonid Frolov

const express = require('express');
const dotenv = require('dotenv');
const contactsRouter = require('./routes/contacts');

dotenv.config();
const app = express();
app.use(express.json());

// Подключаем маршруты
app.use('/contacts', contactsRouter);

module.exports = app;

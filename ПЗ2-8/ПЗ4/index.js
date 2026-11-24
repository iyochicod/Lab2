import express from 'express';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import logger from './logger.js';

const app = express();
const emitter = new EventEmitter();
const PORT = 3000;

// Слухач подій вхідних запитів
emitter.on('newRequest', (url) => {
  console.log(chalk.blue(`[Event] New request received: ${url}`));
});

// Головний маршрут
app.get('/', (req, res) => {
  emitter.emit('newRequest', req.url);
  logger.emit('log', { level: 'info', message: 'GET / accessed' });
  res.send('Chalk + EventEmitter + Express = ❤️');
});

// Інформаційний маршрут
app.get('/info', (req, res) => {
  emitter.emit('newRequest', req.url);
  console.log(chalk.green('Info endpoint accessed!'));
  logger.emit('log', { level: 'info', message: 'GET /info accessed' });
  res.send('Information page logged in green color!');
});

// Маршрут для тестування помилки сервера
app.get('/error-test', (req, res) => {
  emitter.emit('newRequest', req.url);
  logger.emit('log', { level: 'error', message: 'Internal server error' });
  res.status(500).send('Simulated internal server error');
});

// Обробка неіснуючих маршрутів (404)
app.use((req, res) => {
  emitter.emit('newRequest', req.url);
  logger.emit('log', { level: 'warning', message: `Unknown route requested: ${req.url}` });
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(chalk.yellowBright(`Server running at http://localhost:${PORT}`));
  logger.emit('log', { level: 'info', message: 'Server started successfully' });
});

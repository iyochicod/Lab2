import { EventEmitter } from 'events';
import chalk from 'chalk';

const logger = new EventEmitter();

logger.on('log', ({ level = 'info', message = '' }) => {
  const timestamp = new Date().toLocaleString('uk-UA');
  const normalizedLevel = level.toLowerCase();

  switch (normalizedLevel) {
    case 'info':
      console.log(chalk.green(`[${timestamp}] INFO: ${message}`));
      break;
    case 'warning':
      console.log(chalk.yellow(`[${timestamp}] WARNING: ${message}`));
      break;
    case 'error':
      console.log(chalk.red(`[${timestamp}] ERROR: ${message}`));
      break;
    default:
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
});

export default logger;

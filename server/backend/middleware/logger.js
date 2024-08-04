// logger.js
import fs from 'fs';
import path from 'path';

const logFilePath = path.join('C:/Users/SIGISDAC/Documents', 'debug.log');

const log = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
};

export default log;

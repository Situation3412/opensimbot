import { app, ipcMain } from 'electron';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const logMessage = `${prefix} ${message} ${args.length ? JSON.stringify(args) : ''}`;
    
    // Always log to terminal console
    console[level](logMessage);
    
    // Also emit to electron console in packaged app
    if (app.isPackaged) {
      ipcMain.emit('electron:log', null, logMessage);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.isDev) {
      this.log('debug', message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, error?: unknown) {
    if (error instanceof Error) {
      this.log('error', message, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      this.log('error', message, error);
    }
  }
}

export const logger = new Logger(); 
import { SimcError, DownloadError, BuildError, InstallationError } from './errors';
import { logger } from './logger';

export function handleError(error: unknown): SimcError {
  logger.error('Error occurred:', error);

  if (error instanceof SimcError) {
    return error;
  }

  if (error instanceof Error) {
    // Map known error types to specific SimcError subclasses
    if (error.message.includes('download')) {
      return new DownloadError(error.message);
    }
    if (error.message.includes('build')) {
      return new BuildError(error.message);
    }
    return new InstallationError(error.message);
  }

  return new SimcError('An unknown error occurred');
} 
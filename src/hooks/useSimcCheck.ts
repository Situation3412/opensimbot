import { useEffect, useState } from 'react';
import { useSimc } from '../contexts/SimcContext';
import { SimcAPI } from '../electron/types';

const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

declare global {
  interface Window {
    electron: SimcAPI;
  }
}

export const useSimcCheck = () => {
  const { checkInstallation } = useSimc();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkSimc = async () => {
      setIsChecking(true);
      try {
        await checkInstallation();
      } finally {
        setIsChecking(false);
      }
    };

    checkSimc();

    const interval = setInterval(checkSimc, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkInstallation]);

  return { isChecking };
}; 
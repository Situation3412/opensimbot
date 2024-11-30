import { useEffect, useState } from 'react';
import { useSimcContext } from '../contexts/SimcContext';

const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

export function useSimcCheck() {
  const simc = useSimcContext();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isChecking) {
        setIsChecking(true);
        try {
          await simc.checkStatus();
        } finally {
          setIsChecking(false);
        }
      }
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [simc, isChecking]);

  return {
    isChecking
  };
} 
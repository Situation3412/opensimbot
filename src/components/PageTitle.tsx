import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useEffect(() => {
    document.title = `Open SimBot - ${title}`;
    return () => {
      document.title = 'Open SimBot';
    };
  }, [title]);

  return null;
}; 
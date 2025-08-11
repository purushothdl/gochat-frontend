// src/shared/utils/date.utils.ts

// Helper to get the ordinal suffix for a day (st, nd, rd, th)
const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
  
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };
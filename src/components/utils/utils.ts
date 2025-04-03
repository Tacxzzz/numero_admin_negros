
export const formatPeso = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  export const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };


  export function getTransCode(dateString) {
    const date = new Date(dateString);
  
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 03
    const day = String(date.getDate()).padStart(2, "0"); // 14
    const year = String(date.getFullYear()).slice(-2); // 25
    const hours = String(date.getHours()).padStart(2, "0"); // 02
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 07
    const seconds = String(date.getSeconds()).padStart(2, "0"); // 48
  
    return `${month}${day}${year}${hours}${minutes}${seconds}`;
  }
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, currency = 'ZMW') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function getUserInitials(name: string) {
  return name
    ?.split(' ')
    .map((i) => i[0])
    .join('');
}

export function capitalize(str = '') {
  return str?.toString()?.charAt(0)?.toUpperCase() + str?.toString()?.slice(1);
}

export function formatDate(inputDate: string, dateStyle = '') {
  const options: { [key: string]: string } = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const date = new Date(inputDate);

  const formattedDate = date.toLocaleDateString('en', options);

  const [month, day, year] = formattedDate.split(' ');

  const YYYY = date.getFullYear();

  const MM = String(date.getMonth() + 1).padStart(2, '0');

  const DD = String(date.getDate()).padStart(2, '0');

  // Format the date as "YYYY-MM-DD"
  if (dateStyle === 'YYYY-MM-DD') return `${YYYY}-${MM}-${DD}`;

  // Format the date as "DD-MM-YYYY"
  if (dateStyle === 'DD-MM-YYYY') return `${DD}-${MM}-${YYYY}`;

  return `${parseInt(day)}-${month}-${year}`;
}

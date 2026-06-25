import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateStudentId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `IFY-${timestamp}-${random}`;
}

export function calculateProgressPercentage(
  completedDays: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  return Math.round((completedDays / totalDays) * 100);
}

export function calculateDaysRemaining(
  startDate: string,
  endDate: string
): number {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getEstimatedGraduationDate(
  startDate: string,
  duration: number
): string {
  const start = new Date(startDate);
  const graduation = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  return graduation.toISOString().split('T')[0];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

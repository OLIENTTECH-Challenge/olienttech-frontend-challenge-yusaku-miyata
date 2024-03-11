import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const classNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return format(date, 'PPpp', { locale: ja });
};

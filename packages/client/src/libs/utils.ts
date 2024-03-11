export const classNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
};

const currency = new Intl.NumberFormat('sq-AL', { style: 'currency', currency: 'EUR' });
export const money = (cents: number) => currency.format(cents / 100);
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('sq-AL')
    .trim();

export const displayMoney = (value: number | undefined) => {
  if (value === undefined) return '';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

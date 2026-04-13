/** ₺18.500 → plain number string with TR thousand separator */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(amount);

/**
 * Returns { integer: "18.500", decimal: "", symbol: "₺" }
 * so components can style the ₺ and the integer part separately.
 */
export const formatCurrencyParts = (amount: number) => {
  const parts = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).formatToParts(amount);

  let symbol = '₺';
  let integer = '0';

  for (const p of parts) {
    if (p.type === 'currency') symbol = p.value;
    if (p.type === 'integer' || p.type === 'group') {
      if (p.type === 'integer') integer = integer === '0' ? p.value : integer + p.value;
      if (p.type === 'group')   integer = integer + p.value;   // binlik nokta
    }
  }

  // Rebuild cleanly so "18" + "." + "500" → "18.500"
  const integerParts = parts.filter(p => p.type === 'integer' || p.type === 'group');
  integer = integerParts.map(p => p.value).join('');

  return { symbol, integer };
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
  });
};

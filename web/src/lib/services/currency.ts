export interface CurrencyRate {
	code: string;
	symbol: string;
	name: string;
	rate: number;
}

export const fetchCurrencyRates = async (): Promise<CurrencyRate[]> => {
	try {
		const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=VND,EUR,JPY,CNY');
		if (!response.ok) throw new Error('Failed to fetch rates');
		const data = await response.json();

		const currencies = [
			{ code: 'VND', symbol: '₫', name: 'Vietnam' },
			{ code: 'EUR', symbol: '€', name: 'Euro' },
			{ code: 'JPY', symbol: '¥', name: 'Japan' },
			{ code: 'CNY', symbol: '¥', name: 'China' }
		];

		return currencies.map((c) => ({
			...c,
			rate: data.rates[c.code] || 0
		}));
	} catch (error) {
		console.error('Currency fetch error:', error);
		// Return static fallbacks if API fails
		return [
			{ code: 'VND', symbol: '₫', name: 'Vietnam', rate: 25450 },
			{ code: 'EUR', symbol: '€', name: 'Euro', rate: 0.94 },
			{ code: 'JPY', symbol: '¥', name: 'Japan', rate: 154.5 },
			{ code: 'CNY', symbol: '¥', name: 'China', rate: 7.24 }
		];
	}
};

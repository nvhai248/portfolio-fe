type ToastType = 'success' | 'error' | 'info';
type ToastItem = { id: number; message: string; type: ToastType };

let nextId = 0;
let items = $state<ToastItem[]>([]);

const TOAST_DURATION = 4000;

export const toastStore = {
	get items() {
		return items;
	},

	show(message: string, type: ToastType = 'info') {
		const id = nextId++;
		items = [...items, { id, message, type }];

		setTimeout(() => {
			items = items.filter((t) => t.id !== id);
		}, TOAST_DURATION);
	},

	dismiss(id: number) {
		items = items.filter((t) => t.id !== id);
	},

	success(message: string) {
		this.show(message, 'success');
	},

	error(message: string) {
		this.show(message, 'error');
	}
};

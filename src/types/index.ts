export type PaymentMethod = 'card' | 'cash';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// типизация ошибок при заполнении форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// базовый тип для товара
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IBasketCard {
	title: string;
	price: number;
}

export interface IOrderAddress {
	payment: PaymentMethod;
	address: string;
}

export interface IContactsOrder {
	email: string;
	phone: string;
}

export interface IAppStateModel {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder | null;
}

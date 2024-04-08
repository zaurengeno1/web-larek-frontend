import { Model } from './base/Model';
import { IEvents } from '../components/base/events';
import {
	FormErrors,
	IAppStateModel,
	IProductItem,
	IOrder,
	IContactsOrder,
	PaymentMethod,
} from '../types';

// Тип для события изменения каталога
export type CatalogChangeEvent = {
	catalog: Product[];
};

// Класс продукта
export class Product extends Model<IProductItem> implements IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Основная модель приложения
export class AppModel extends Model<IAppStateModel> {
	basket: IProductItem[] = []; // Корзина
	catalog: IProductItem[] = []; // Каталог товаров
	order: IOrder = {
		// Заказ
		payment: 'card',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};
	preview: string | null; // Предпросмотр
	formErrors: FormErrors = {}; // Ошибки формы

	constructor(data: Partial<IAppStateModel>, protected events: IEvents) {
		super(data, events);
	}

	// Добавление товара в корзину
	addProduct(product: IProductItem): void {
		this.basket.push(product);
		this.emitChanges('basket:change');
	}

	// Удаление товара из корзины
	deleteProduct(id: string): void {
		this.basket = this.basket.filter((product) => product.id !== id);
		this.emitChanges('basket:change');
	}

	// Сброс заказа
	resetOrder(): void {
		this.order = {
			payment: 'card',
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
	}

	// Сброс корзины
	resetBasket(): void {
		this.basket.length = 0;
		this.resetOrder();
		this.emitChanges('basket:change');
	}

	// Получение общей стоимости заказа
	getTotalOrder(): number {
		return this.basket.reduce((result, product) => result + product.price, 0);
	}

	// Установка каталога товаров
	setCatalog(products: IProductItem[]): void {
		this.catalog = products.map((product) => new Product(product, this.events));
		this.emitChanges('catalog:change', { catalog: this.catalog });
	}

	// Получение товаров в корзине
	getOrderedProducts(): IProductItem[] {
		return this.basket;
	}

	// Проверка, находится ли товар в корзине
	productOrdered(product: IProductItem): boolean {
		return this.basket.includes(product);
	}

	// Передача данных из корзины в заказ
	setOrder(): void {
		this.order.total = this.getTotalOrder();
		this.order.items = this.getOrderedProducts().map((product) => product.id);
	}

	// Валидация заказа (проверка способа оплаты и адреса)
	validateOrder(): void {
		const errors: FormErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formAddresErrors:change', this.formErrors);
	}

	// Установка способа оплаты
	setPaymentMethod(method: PaymentMethod): void {
		this.order.payment = method;
		this.validateOrder();
	}

	// Валидация контактных данных
	validateContacts(): void {
		const errors: FormErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
	}

	// Установка контактной информации
	setContactsField(field: keyof Partial<IContactsOrder>, value: string): void {
		this.order[field] = value;
		this.validateContacts();
	}

	// Установка адреса доставки
	setAddress(value: string): void {
		this.order.address = value;
		this.validateOrder();
	}
}

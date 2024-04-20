import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { AppModel, Product, CatalogChangeEvent } from './components/AppData';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';

import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { BasketCard } from './components/BasketCard';
import { OrderAddress } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';
import { IContactsOrder, IOrderAddress, PaymentMethod } from './types';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppModel({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Получаем лоты с сервера, заполняем модель данных о катологе

events.on<CatalogChangeEvent>('catalog:change', () => {
	page.catalog = appData.catalog.map((product) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:change', product),
		});
		return card.render({
			category: product.category,
			title: product.title,
			image: product.image,
			price: product.price,
		});
	});
	page.counter = appData.getOrderedProducts().length;
});

//Получаем карточки с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Обработчик события изменения предварительного просмотра товара
events.on('preview:change', (item: Product) => {
	if (item) {
		// Создание новой карточки товара
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.productOrdered(item)) {
					events.emit('product:delete', item);
				} else {
					// Эмитирование события добавления товара
					events.emit('product:added', item);
				}
			},
		});
		// Отображение карточки товара в модальном окне
		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				description: item.description,
				image: item.image,
				price: item.price,

				button: appData.productOrdered(item) ? 'Удалить из корзины' : 'Купить',
			}),
		});
	} else {
		// Закрытие модального окна, если товар не выбран
		modal.close();
	}
});

// товар добавлен в корзину
events.on('product:added', (item: Product) => {
	appData.addProduct(item);
	modal.close();
});

// товар удален из корзины
events.on('product:delete', (item: Product) => {
	appData.deleteProduct(item.id);
	modal.close();
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Изменились данные в корзине
events.on('basket:change', () => {
	page.counter = appData.getOrderedProducts().length;

	basket.items = appData.getOrderedProducts().map((product, index) => {
		const card = new BasketCard(index, cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteProduct(product.id);

				basket.total = appData.getTotalOrder();
			},
		});

		return card.render({ title: product.title, price: product.price });
	});

	// переход к оформлению заказа
	// Открыть форму заказа
	events.on('order:open', () => {
		order.setButtonClass('');

		modal.render({
			content: order.render({
				//payment: null,
				address: '',
				valid: false,
				errors: [],
			}),
		});
	});

	events.on('contacts:open', () => {
		modal.render({
			content: contacts.render({
				phone: '',
				email: '',
				valid: false,
				errors: [],
			}),
		});
	});

	// выбрать оплату
	events.on('payment:changed', (data: { target: PaymentMethod }) => {
		appData.setPaymentMethod(data.target);
	});

	// Обновляем общую стоимость заказа в корзине
	basket.total = appData.getTotalOrder();
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// Изменилось состояние валидации формы kонтактов
events.on('formContactsErrors:change', (errors: Partial<IContactsOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы с адресом
events.on('formAddresErrors:change', (errors: Partial<IOrderAddress>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменился адрес доставки
events.on('order.address:change', (data: { value: string }) => {
	appData.setAddress(data.value);
});

// Изменилось одно поле формы с контактами
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsOrder; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Отправлена формы доставки
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.setOrder();
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(successTemplate),
				appData.order.total,
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			modal.render({ content: success.render({}) });
			appData.resetBasket();
			order.setButtonClass('');
			events.emit('basket:change');
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

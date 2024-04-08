import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { createElement, ensureElement, formatNumber } from '../../utils/utils';

interface IBasket {
	items: HTMLElement[]; // интерфейс для корзины, содержащий массив элементов
	total: number; // общая стоимость корзины
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement; // элемент списка товаров в корзине
	protected _total: HTMLElement; // элемент для отображения общей стоимости
	protected _button: HTMLElement; // кнопка закрытия корзины

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container); // вызов конструктора родительского класса

		this._list = ensureElement<HTMLElement>('.basket__list', this.container); // находим элемент списка в корзине
		this._total = this.container.querySelector('.basket__price'); // находим элемент для отображения общей стоимости
		this._button = this.container.querySelector('.basket__button'); // находим кнопку закрытия корзины

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open'); // добавляем обработчик события для открытия доставки
			});
		}

		this.items = []; // инициализация списка товаров
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items); // заменяем содержимое списка товарами
			this.setDisabled(this._button, false); // разблокируем кнопку закрытия корзины
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			); // отображаем сообщение о пустой корзине
			this.setDisabled(this._button, true); // блокируем кнопку закрытия корзины
		}
	}

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`); // устанавливаем общую стоимость с отформатированным текстом
	}
}

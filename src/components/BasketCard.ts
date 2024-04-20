import { Component } from './base/Component';
import { ICardActions } from '../types';
import { ensureElement } from '../utils/utils';
import { Card } from './Card';

// Класс BasketCard расширяет базовый компонент и представляет карточку товара в корзине
export class BasketCard extends Component<Card> {
	protected _index: HTMLElement; // Элемент для отображения индекса товара в корзине
	protected _title: HTMLElement; // Элемент для отображения названия товара
	protected _button: HTMLButtonElement; // Кнопка для выполнения действия с товаром
	protected _price: HTMLElement; // Элемент для отображения цены товара

	constructor(idx: number, container: HTMLElement, events: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this.index = idx;
		this._button.addEventListener('click', events.onClick);
	}

	// Сеттер для установки названия товара
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Сеттер для установки цены товара
	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}

	// Сеттер для установки индекса товара
	set index(value: number) {
		this.setText(this._index, value + 1);
	}
}

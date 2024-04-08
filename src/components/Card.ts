import { Component } from './base/Component';
import { IProductItem, ICardActions } from '../types';
import { ensureElement, formatNumber } from '../utils/utils';
import { cardCategory } from '../utils/constants';

// Определение типа ICard, расширяющего IProductItem новыми свойствами
export type ICard = IProductItem & {
	id?: string;
	description?: string;
	button?: string;
};

// Класс Card, наследуемый от Component, для создания карточки товара
export class Card extends Component<ICard> {
	protected _title: HTMLElement; // Заголовок карточки
	protected _image: HTMLImageElement; // Изображение товара
	protected _description?: HTMLElement; // Описание товара
	protected _button?: HTMLButtonElement; // Кнопка на карточке
	protected _price: HTMLElement; // Цена товара
	protected _category: HTMLElement; // Категория товара

	// Конструктор класса
	constructor(blockName: string, container: HTMLElement, events: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._description = container.querySelector(`.${blockName}__text`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = ensureElement<HTMLImageElement>(
			`.${blockName}__price`,
			container
		);
		this._category = ensureElement<HTMLImageElement>(
			`.${blockName}__category`,
			container
		);

		if (this._button) {
			this._button.addEventListener('click', events.onClick);
		} else {
			container.addEventListener('click', events.onClick);
		}
	}

	// Сеттеры для установки значений элементов карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, `${formatNumber(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this._button.setAttribute('disabled', '');
			}
		}
	}

	// Геттер для получения значения цены
	get price(): number {
		return Number(this._price.textContent);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add('card__category' + cardCategory[value]);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}

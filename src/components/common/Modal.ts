import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

// Определение интерфейса данных для модального окна
interface IModalData {
	content: HTMLElement; // Содержимое модального окна
}

// Класс Modal расширяет базовый компонент и представляет модальное окно
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
	protected _content: HTMLElement; // Контейнер для содержимого модального окна

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов модального окна
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Добавление обработчиков событий
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Сеттер для установки содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод для открытия модального окна
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// Метод для закрытия модального окна
	close() {
		this.container.classList.remove('modal_active');
		this.content = null; // Очистка содержимого при закрытии
		this.events.emit('modal:close');
	}

	// Метод для рендеринга модального окна с заданными данными
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

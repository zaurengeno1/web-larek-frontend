import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormState {
	valid: boolean; // Валидность формы
	errors: string[]; // Список ошибок валидации
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement; // Кнопка отправки формы
	protected _errors: HTMLElement; // Элемент для отображения ошибок валидации

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// Добавление обработчиков событий
		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			this.onInputChange(target.name as keyof T, target.value);
		});
		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// Обработчик изменения значения поля ввода
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Сеттер для установки валидности формы
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Сеттер для установки ошибок валидации
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Метод для рендеринга состояния формы
	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

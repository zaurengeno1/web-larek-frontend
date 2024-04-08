import { Component } from '../base/Component';
import { ensureElement, formatNumber } from '../../utils/utils';

// Определение интерфейса для данных компонента Success
interface ISuccess {
	total: number; // Общая сумма
}

// Определение интерфейса для действий компонента Success
interface ISuccessActions {
	onClick: () => void; // Функция, вызываемая при клике
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, total: number, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		// Установка текста с общей суммой и добавление обработчика события клика
		this._total.textContent = 'Списано ' + formatNumber(total) + ' синапсов';
		this._close.addEventListener('click', actions.onClick);
	}
}

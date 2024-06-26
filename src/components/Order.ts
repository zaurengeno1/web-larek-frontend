import { Form } from './common/Form';
import { IOrderAddress } from '../types';
import { IEvents } from './base/Events';

export class OrderAddress extends Form<IOrderAddress> {
	protected _buttons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = Array.from(container.querySelectorAll('.button_alt'));

		this._buttons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setButtonClass(name);
				events.emit('payment:changed', { target: name });
			})
		);
	}

	// setButtonClass(name: string): void {
	// 	this._buttons.forEach((button) => {
	// 		if (button.name === name) {
	// 			this.toggleClass(button, 'button_alt-active');
	// 		} else {
	// 			this.toggleClass(button, 'button_alt-inactive');
	// 		}
	// 	});
	// }
	setButtonClass(name: string): void {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}
}

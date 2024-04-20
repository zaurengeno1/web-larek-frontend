import { Form } from './common/Form';
import { IContactsOrder } from '../types';
import { IEvents } from './base/Events';

export class Contacts extends Form<IContactsOrder> {
	private phoneInput: HTMLInputElement;
	private emailInput: HTMLInputElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this.emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}

	set email(value: string) {
		this.emailInput.value = value;
	}
}

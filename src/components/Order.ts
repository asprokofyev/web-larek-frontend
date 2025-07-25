import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class Order extends Form<Partial<IOrderForm>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set address(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

export class Contacts extends Form<Partial<IOrderForm>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

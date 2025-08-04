// классы отображения форм оформления заказа

import { ClientEmail, ClientPhone, IOrderForm } from '../../types';
import { IEvents } from '../events_broker/events';
import { Form } from './base/Form';

// шаг2. форма ввода email и номера телефона
export class Contacts extends Form<Partial<IOrderForm>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: ClientPhone) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: ClientEmail) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

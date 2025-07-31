// классы отображения форм оформления заказа

import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

// шаг 1. форма выбора способа оплаты и адреса доставки
export class Order extends Form<Partial<IOrderForm>> {
	protected _buttonOnline: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonOnline = this.container.elements.namedItem(
			'online'
		) as HTMLButtonElement;

		this._buttonCash = this.container.elements.namedItem(
			'cash on delivery'
		) as HTMLButtonElement;

		this._buttonOnline.addEventListener('click', () => {
			this._buttonOnline.classList.add('button_alt-active');
			this._buttonCash.classList.remove('button_alt-active');
			this.onFieldChange('payment', this._buttonOnline.name);
		});

		this._buttonCash.addEventListener('click', () => {
			this._buttonOnline.classList.remove('button_alt-active');
			this._buttonCash.classList.add('button_alt-active');
			this.onFieldChange('payment', this._buttonCash.name);
		});
	}

	set payment(value: string) {
		if (value) {
			this.toggleClass(
				this.container.elements.namedItem(value) as HTMLButtonElement,
				'button_alt-active',
				true
			);
		} else {
			this._buttonOnline.classList.remove('button_alt-active');
			this._buttonCash.classList.remove('button_alt-active');
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

// шаг2. форма ввода email и номера телефона
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

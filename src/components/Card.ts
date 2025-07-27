// вывод карточки прожукта
// три вида карточки - три класса: карточка на странице, карточка в модальном окне, карточка в корзине

import { formatNumber } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type categoryTypes =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

const categoryClasses: Record<categoryTypes, string> = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export interface ICard {
	id: string; // id продукта
	title: string; // заголовок. используется всегда
	description?: string; // описание. используется только при просмотре в модальном окне
	image?: string; // картинка. используется в списке и в модальном окне
	price: number; // используетмся всегда
	itemIndex: number; // номер продукта по порядку
	category?: categoryTypes; // используется в списке и в модальном окне
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement; // кнопка "Купить" / "Убрать"
	protected _price: HTMLElement;
	protected _itemIndex?: HTMLElement; // номер продукта по порядку в корзине

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = container.querySelector(`.card__title`);
		this._image = container.querySelector(`.card__image`);
		this._button = container.querySelector(`.card__button`);
		this._description = container.querySelector(`.card__text`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.card__price`);
		this._itemIndex = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: categoryTypes) {
		this.setText(this._category, String(value));
		this.toggleClass(this._category, categoryClasses[value]);
	}

	set price(value: number) {
		let priceText = '';
		if (!value) {
			priceText = 'Бесценно';
			this.setDisabled(this._button, true);
		} else {
			priceText = `${formatNumber(value)} синапсов`;
		}
		this.setText(this._price, priceText);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set itemIndex(value: number) {
		this.setText(this._itemIndex, String(value));
	}

	changeButton(price: number, inBasket: boolean): void {
		if (!price) {
			this.setText(this._button, 'Недоступно');
			this.setDisabled(this._button, true);
		} else {
			if (inBasket) {
				this.setText(this._button, 'Убрать');
			} else {
				this.setText(this._button, 'Купить');
			}
		}
	}
}

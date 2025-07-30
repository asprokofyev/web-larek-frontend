// вывод карточки прожукта
// три вида карточки - три класса: карточка на странице, карточка в модальном окне, карточка в корзине

import { categoryTypes, ICard, ICardActions } from '../types';
import { settings } from '../utils/constants';
import { formatNumber } from '../utils/utils';
import { Component } from './base/Component';

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

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: categoryTypes) {
		this.setText(this._category, String(value));
		this.toggleClass(this._category, settings.categoryClasses[value]);
	}

	set price(value: number) {
		let priceText = '';
		if (!value) {
			priceText = settings.messages.card.noprice;
			this.setDisabled(this._button, true);
		} else {
			priceText = formatNumber(value) + ' ' + settings.currency;
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
			this.setText(this._button, settings.messages.buyButtonValues.disabled);
			this.setDisabled(this._button, true);
		} else {
			if (inBasket) {
				this.setText(this._button, settings.messages.buyButtonValues.delete);
			} else {
				this.setText(this._button, settings.messages.buyButtonValues.add);
			}
		}
	}
}

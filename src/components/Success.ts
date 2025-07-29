import { settings } from '../utils/constants';
import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';
import { ISuccess, ISuccessActions } from '../types/index';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(
			this._total,
			settings.messages.success.replace('summa', formatNumber(value))
		);
	}
}

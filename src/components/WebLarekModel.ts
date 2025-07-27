import {
	FormErrors,
	IOrder,
	IOrderForm,
	IProduct,
	IWebLarekState,
} from '../types';
import { Model } from './base/Model';

// основной каласс работы с данными приложения
export class WebLarek extends Model<IWebLarekState> {
	catalog: IProduct[]; // данные каталога
	order: IOrder = {
		// данные корзины/заказа
		email: '',
		phone: '',
		payment: '',
		address: '',
		items: [],
		total: 0,
	};
	preview: string | null; // id просмотриваемого продукта в модальном окне
	formErrors: FormErrors = {}; // массив ошибок формы

	// сохранить данные каталога полученные из api
	setProducts(items: IProduct[]) {
		this.catalog = items;
		this.events.emit('products:changed');
	}

	// возвращает данные конкретного продукта
	getProduct(id: string): IProduct {
		return this.catalog.find((item) => item.id === id);
	}

	// добавить продукт в корзину
	addToBasket(id: string): void {
		this.order.items.push(id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	// удалить продукт из корзины
	deleteFromBasket(id: string): void {
		this.order.items = this.order.items.filter((item) => item !== id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	// проверить наличие продукта в корзине
	inBasket(id: string): boolean {
		return this.order.items.find((item) => item === id) ? true : false;
	}

	// посчитать количество продуктов в корзине
	getProductsInBasketCount(): number {
		return this.order.items.length;
	}

	// посчитать общую стоимость продуктов корзины/заказа
	getTotal(): number {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	// очистить корзину/заказ после успешной отправки на сервер
	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			items: [],
			total: 0,
		};
		this.events.emit('products:changed');
	}

	// заполнение полей заказа из формы с шага 1
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		this.validateOrder();
	}

	// заполнение полей заказа из формы с шага 2
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		this.validateContacts();
	}

	// проврека готовности заказа
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.order.address) {
			errors.phone = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
	}

	// установить id выбранного к просмотру в модальном окне продукта
	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}

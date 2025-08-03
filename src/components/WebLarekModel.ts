import {
	FormErrors,
	IOrder,
	IOrderForm,
	IProduct,
	IWebLarekState,
	Price,
	ProductsCount,
	UniqId,
} from '../types';
import { settings } from '../utils/constants';
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
	preview: UniqId | null; // id просмотриваемого продукта в модальном окне
	formErrors: FormErrors = {}; // массив ошибок формы

	// сохранить данные каталога полученные из api
	setProducts(items: IProduct[]): void {
		this.catalog = items;
		this.events.emit('products:changed');
	}

	// возвращает данные конкретного продукта
	getProduct(id: UniqId): IProduct {
		return this.catalog.find((item) => item.id === id);
	}

	// добавить продукт в корзину
	addToBasket(id: UniqId): void {
		this.order.items.push(id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	// удалить продукт из корзины
	deleteFromBasket(id: UniqId): void {
		this.order.items = this.order.items.filter((item) => item !== id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	// проверить наличие продукта в корзине
	inBasket(id: UniqId): boolean {
		return this.order.items.find((item) => item === id) ? true : false;
	}

	// посчитать количество продуктов в корзине
	getProductsInBasketCount(): ProductsCount {
		return this.order.items.length;
	}

	// посчитать общую стоимость продуктов корзины/заказа
	getTotal(): Price {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	// очистить корзину/заказ после успешной отправки на сервер
	clearBasket(): void {
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

	// заполнение полей заказа из формы выбора типа оплаты и ввода адреса доставки
	setOrderField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;

		this.validateOrder();
	}

	// заполнение полей заказа из формы ввода номера телефон и email-a
	setContactsField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;

		this.validateContacts();
	}

	// проврека формы выбора типа оплаты и ввода адреса доставки
	validateOrder(): void {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = settings.messages.formErrors.payment;
		}
		if (!this.order.address) {
			errors.phone = settings.messages.formErrors.address;
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
	}
	// проврека формы выбора ввода номера телефон и email-a
	validateContacts(): void {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = settings.messages.formErrors.email;
		}
		if (!this.order.phone) {
			errors.phone = settings.messages.formErrors.phone;
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
	}

	// установить id выбранного к просмотру в модальном окне продукта
	setPreview(item: IProduct): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}

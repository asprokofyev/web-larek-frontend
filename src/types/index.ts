export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number;
}

export interface IProductsCatalog {
	items: IProduct[];
}

export interface IProductsCatalogData extends IProductsCatalog {
	total: number;
}

export interface IProductsModel extends IProductsCatalog {
	setProducts(items: IProduct[]): void; // наполенение каталога продуктов данными загруженнми через API с сервера
	getProducts(): IProduct[]; // возвращает весь массив продуктов
	getProduct(id: string): IProduct; // возвращает конкретный продутк по ID
}

export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}
export interface IOrder extends IOrderForm {
	items: string[]; // массив id
	total: number;
}

export interface IOrderAnswer {
	id: string;
	total: number;
}

export interface IBasket extends IOrder {
	add(id: string): void; // добавляет id продукта в корзину
	delete(id: string): void; // удаляет id продукта из корзины
	getTotal(): number; // возвращает количество продуктов в корзине
}

export interface IPage {
	products: HTMLElement[]; // массив карточек продуктов каталога
	basketTotal: number; // количество продуктов в корзине
	locked: boolean; // признак блокировки страницы при открытии модального окна
}

export interface IBasketView {
	items: HTMLElement[]; // массив карточек продуктов добавленных в корзину
	total: number; // общая стоимость продуктов в корзине
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

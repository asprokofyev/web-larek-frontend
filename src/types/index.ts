/*
  Алиасы для стандартных типов для большей прозрачности предметной области продукта
*/

export type UniqId = string;
export type ProductTitle = string;
export type ProductCategory = string;
export type ProductDescription = string;
export type ProductImageUrl = string;
export type Price = number;
export type ProductsCount = number;
export type PaymentMethod = string;
export type ClientEmail = string;
export type ClientPhone = string;
export type ClientAddress = string;

/*
  Типы данных и интерфейсы модели  (Model)
*/

// тип Продукт - данные одного продукта
export interface IProduct {
	id: UniqId; // уникалный id
	title: ProductTitle; // название продукта
	category: ProductCategory; // катетегория/тэг
	description: ProductDescription; // описание продукта
	image: ProductImageUrl; // путь до картинки
	price: Price; // цена продукта
}

// Тип Каталог продуктов - это просто массив продуктов
export interface IProductsCatalog {
	items: IProduct[]; // массив продуктов
}

// интерфейс модели данных всего приложения
export interface IWebLarekState {
	catalog: IProduct[]; // массив продуктов, с которым работает приложение
	preview: UniqId | null; // id продукта для просмотра в модальном окне
	order: IOrder | null; // данные текущего заказа: корзина + данные клиента
	formErrors: FormErrors; // ошибки валидации форм
	setProducts(items: IProduct[]): void; // сохранить данные каталога полученные из api
	getProduct(id: UniqId): IProduct; // возвращает данные конкретного продукта
	addToBasket(id: UniqId): void; // добавить продукт в корзину
	deleteFromBasket(id: UniqId): void; // удалить продукт из корзины
	inBasket(id: UniqId): boolean; // проверить наличие продукта в корзине
	getProductsInBasketCount(): ProductsCount; // посчитать количество продуктов в корзине
	getTotal(): Price; // посчитать общую стоимость продуктов корзины/заказа
	clearBasket(): void; // очистить корзину/заказ после успешной отправки на сервер
	setOrderField(field: keyof IOrderForm, value: string): void; // заполнение полей заказа из формы выбора типа оплаты и ввода адреса доставки
	setContactsField(field: keyof IOrderForm, value: string): void; // заполнение полей заказа из формы ввода номера телефон и email-a
	validateOrder(): void; // проврека формы выбора типа оплаты и ввода адреса доставки
	validateContacts(): void; // проврека формы выбора ввода номера телефон и email-a
	setPreview(item: IProduct): void; // установить id выбранного к просмотру в модальном окне продукта
}

// данные заказа, которые вводятся пользоватлем через форму
export interface IOrderForm {
	payment: PaymentMethod; // способ оплаты
	email: ClientEmail; // email клиента
	phone: ClientPhone; // телефон клиента
	address: ClientAddress; // адрес доставки
}

// заказ состоит из данных из формы + массив id продуктов и их общей стоимости из корзины
export interface IOrder extends IOrderForm {
	items: UniqId[]; // массив id продуктов
	total: Price; // общая стоимость заказа
}

/*
  Типы данных и интерфейсы отображения (View)
*/
// интерфейс отображения страницы
export interface IPage {
	products: HTMLElement[]; // массив карточек продуктов каталога
	locked: boolean; // признак блокировки страницы при открытии модального окна
	counter: ProductsCount; // количество продуктов в корзине
}

// интерфес отображения корзины
export interface IBasketView {
	items: HTMLElement[]; // массив карточек продуктов добавленных в корзину
	total: Price; // общая стоимость продуктов в корзине
}

// интерфейс отображения карточки продукта
export interface ICard {
	id: UniqId; // id продукта
	title: ProductTitle; // заголовок. используется всегда
	description?: ProductDescription; // описание. используется только при просмотре в модальном окне
	image?: ProductImageUrl; // картинка. используется в списке и в модальном окне
	price: Price; // используетмся всегда
	itemIndex: number; // номер продукта по порядку
	category?: categoryTypes; // используется в списке и в модальном окне
	changeButton(price: Price, inBasket: boolean): void; // замена текста на кнопке "купить" в зависимости от статуса продукта
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// интерфес отображения окна об успешном оформлении заказа
export interface ISuccess {
	total: Price; // сумма заказа
}

export interface ISuccessActions {
	onClick: () => void;
}

// интерфейс отображения модального окна
export interface IModalData {
	content: HTMLElement;
}

// тип Категория продукта. Нужен для маппинга значения категории в класс оформления в верстке
export type categoryTypes =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// тип Ошибки валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

/*
  Типы данных и интерфейсы Api
*/

// интерфейс api приложения
export interface IWebLarekApi {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	sendOrder: (data: Partial<IOrder>) => Promise<IOrderAnswer>;
}

// тип данных каталога продуктов в api. api кроме массива продуктов еще отдает их общее количество
export interface IProductsCatalogData extends IProductsCatalog {
	total: ProductsCount; // количество продуктов в каталоге
}

// тип данных ответа от api при отправке заказа на сервер
export interface IOrderAnswer {
	id: UniqId; // уникальный номер заказа
	total: Price; // общая сумма заказа
}

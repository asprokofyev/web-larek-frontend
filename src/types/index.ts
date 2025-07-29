/*
  Типы данных и интерфейсы модели  (Model)
*/

// тип Продукт - данные одного продукта
export interface IProduct {
	id: string; // уникалный id
	title: string; // название продукта
	category: string; // катетегория/тэг
	description: string; // описание продукта
	image: string; // путь до картинки
	price: number; // цена продукта
}

// Тип Каталог продуктов - это просто массив продуктов
export interface IProductsCatalog {
	items: IProduct[]; // массив продуктов
}

// интерфейс модели данных всего приложения
export interface IWebLarekState {
	catalog: IProduct[]; // массив продуктов, с которым работает приложение
	preview: string | null; // id продукта для просмотра в модальном окне
	order: IOrder | null; // данные текущего заказа: корзина + данные клиента
	formErrors: FormErrors; // ошибки валидации форм
  setProducts(items: IProduct[]): void; // сохранить данные каталога полученные из api
  getProduct(id: string): IProduct; // возвращает данные конкретного продукта
	addToBasket(id: string): void; // добавить продукт в корзину
  deleteFromBasket(id: string): void; // удалить продукт из корзины
  inBasket(id: string): boolean; // проверить наличие продукта в корзине
  getProductsInBasketCount(): number; // посчитать количество продуктов в корзине
  getTotal(): number; // посчитать общую стоимость продуктов корзины/заказа
  clearBasket(): void; // очистить корзину/заказ после успешной отправки на сервер
  setOrderField(field: keyof IOrderForm, value: string): void; // заполнение полей заказа из формы выбора типа оплаты и ввода адреса доставки
  setContactsField(field: keyof IOrderForm, value: string): void; // заполнение полей заказа из формы ввода номера телефон и email-a
  validateOrder(): void; // проврека формы выбора типа оплаты и ввода адреса доставки
  validateContacts(): void; // проврека формы выбора ввода номера телефон и email-a
  setPreview(item: IProduct): void; // установить id выбранного к просмотру в модальном окне продукта
}

// данные заказа, которые вводятся пользоватлем через форму
export interface IOrderForm {
	payment: string; // способ оплаты
	email: string; // email клиента
	phone: string; // телефон клиента
	address: string; // адрес доставки
}

// заказ состоит из данных из формы + массив id продуктов и их общей стоимости из корзины
export interface IOrder extends IOrderForm {
	items: string[]; // массив id продуктов
	total: number; // общая стоимость заказа
}

/*
  Типы данных и интерфейсы отображения (View)
*/
// интерфейс отображения страницы
export interface IPage {
	products: HTMLElement[]; // массив карточек продуктов каталога
	locked: boolean; // признак блокировки страницы при открытии модального окна
	counter: number; // количество продуктов в корзине
}

// интерфес отображения корзины
export interface IBasketView {
	items: HTMLElement[]; // массив карточек продуктов добавленных в корзину
	total: number; // общая стоимость продуктов в корзине
}

// интерфейс отображения карточки продукта
export interface ICard {
	id: string; // id продукта
	title: string; // заголовок. используется всегда
	description?: string; // описание. используется только при просмотре в модальном окне
	image?: string; // картинка. используется в списке и в модальном окне
	price: number; // используетмся всегда
	itemIndex: number; // номер продукта по порядку
	category?: categoryTypes; // используется в списке и в модальном окне
	changeButton(price: number, inBasket: boolean): void; // замена текста на кнопке "купить" в зависимости от статуса продукта
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// интерфес отображения окна об успешном оформлении заказа
export interface ISuccess {
	total: number; // сумма заказа
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
	total: number; // количество продуктов в каталоге
}

// тип данных ответа от api при отправке заказа на сервер
export interface IOrderAnswer {
	id: string; // уникальный номер заказа
	total: number; // общая сумма заказа
}

/*--------------------------------------------------------
  Типы и интерфейсы модели данных (Model)
--------------------------------------------------------*/

// данные одного продукта
export interface IProduct {
	id: string; // уникалный id
	title: string; // название продукта
	category: string; // катетегория/тэг
	description: string; // описание продукта
	image: string; // путь до картинки
	price: number; // цена продукта
}

// каталог продуктов - это просто массив продуктов
export interface IProductsCatalog {
	items: IProduct[]; // массив продуктов
}

// модель данных всего приложения
export interface IWebLarekState {
	catalog: IProduct[]; // массив продуктов, с которым работает приложение
	preview: string | null; // id продукта для просмотра в модальном окне
	order: IOrder | null; // данные текущего заказа: корзина + данные клиента
	formErrors: FormErrors; // ошибки валидации форм
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

/*--------------------------------------------------------
  Типы данных отображения (View)
--------------------------------------------------------*/

export type FormErrors = Partial<Record<keyof IOrder, string>>;

/*--------------------------------------------------------
  Типы данных Api
--------------------------------------------------------*/

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

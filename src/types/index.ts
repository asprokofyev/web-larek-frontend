// данные одного продукта
export interface IProduct {
	id: string;	// уникалный id
	title: string; // название продукта
	category: string;	// катетегория/тэг
	description: string; // описание продукта
	image: string; // путь до картинки
	price: number; // цена продукта
}

// каталог продуктов - это просто массив продуктов
export interface IProductsCatalog {
	items: IProduct[];	// массив продуктов
}

// интефейс для каталога продуктов в api. api кроме массива продуктов еще отдает их общее количество 
export interface IProductsCatalogData extends IProductsCatalog {
	total: number;	// количество продуктов в каталоге
}

// модель данных всего приложения
export interface IWebLarekState {
	catalog: IProduct[]; // массив продуктов, с которым работает приложение
	preview: string | null; // id продукта для просмотра в модальном окне
	order: IOrder | null; // данные текущего заказа: корзина + данные клиента
}

// данные заказа, которые вводятся пользоватлем через форму 
export interface IOrderForm {
	payment: string;	// способ оплаты
	email: string;	// email клиента
	phone: string;	// телефон клиента
	address: string;	// адрес доставки 
}

// заказ состоит из данных из формы + массив id продуктов и их общей стоимости из корзины 
export interface IOrder extends IOrderForm {
	items: string[]; // массив id продуктов
	total: number; // общая стоимость заказа
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

// интерфейс для ответа от api при отправке заказа на сервер
export interface IOrderAnswer {
	id: string; // уникальный номер заказа
	total: number; // общая сумма заказа
}

export interface IProductModel {
	id: string;
	title: string;
	description: string;
	photo: string;
	tag: string;
	price: number;
}

export interface IBasketModel {
  
  total: number;
}

export interface IProductModel {
	products: IProduct[];
	paymentMethod: number;
	clientAddress: string;
	clientEmail: string;
	clientPhone: string;
	summa: number;
}

export interface IPage {
	productsList: HTMLElement[];
	basket: HTMLElement;
}

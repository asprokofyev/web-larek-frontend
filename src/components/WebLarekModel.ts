import { IProduct, IProductsModel } from '../types';
import { IEvents } from './base/events';

export class ProductsModel implements IProductsModel {
	items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	getProducts(): IProduct[] {
		return this.items;
	}

	getProduct(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	setProducts(items: IProduct[]) {
		this.items = items;
		this.events.emit('products:changed');
	}
}

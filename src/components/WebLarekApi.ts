import { IOrder, IOrderAnswer, IProduct, IProductsCatalogData } from '../types';
import { Api } from './base/api';

export class WebLarekApi extends Api {
	getProducts(): Promise<IProductsCatalogData> {
		return this.get('/product/');
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`);
	}

	sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer> {
		return this.post('/order', data);
	}
}

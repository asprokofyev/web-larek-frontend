import { IOrder, IProduct } from '../types';
import { Api } from './base/api';

export class WebLarekApi extends Api {
	getProducts(): Promise<IProduct[]> {
		return this.get('/product');
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`);
	}

	sendOrder(data: Partial<IOrder>): Promise<IOrder> {
		return this.post('/order', data);
	}
}

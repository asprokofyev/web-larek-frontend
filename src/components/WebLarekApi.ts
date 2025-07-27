// api для обмена данными с сервером

import { IOrder, IOrderAnswer, IProduct, IProductsCatalogData } from '../types';
import { Api } from './base/api';

export class WebLarekApi extends Api {
	// загрузка всего каталога продуктов
	getProducts(): Promise<IProductsCatalogData> {
		return this.get('/product/');
	}

	// загрузка данных одного продукта. в есть, но в проекте не используется...
	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`);
	}

	// отправка заказа на сервер
	sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer> {
		return this.post('/order', data);
	}
}

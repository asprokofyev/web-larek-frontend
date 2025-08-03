// api для обмена данными с сервером

import {
	IOrder,
	IOrderAnswer,
	IProduct,
	IProductsCatalogData,
	IWebLarekApi,
	UniqId,
} from '../types';
import { Api } from './base/api';

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// загрузка всего каталога продуктов
	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: IProductsCatalogData) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// загрузка данных одного продукта. в есть, но в проекте не используется...
	getProduct(id: UniqId): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	// отправка заказа на сервер
	sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer> {
		return this.post('/order', data).then((data: IOrderAnswer) => data);
	}
}

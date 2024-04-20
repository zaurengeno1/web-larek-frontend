import { Api, ApiListResponse } from './base/Api';
import { IOrder, IProductItem, IOrderResult } from '../types';

export interface ILarekAPI {
	getProductList: () => Promise<IProductItem[]>;
	getProduct: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// запрос продукта по Id
	getProduct(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((product: IProductItem) => ({
			...product,
			image: this.cdn + product.image,
		}));
	}
	// запрос списка продуктов с сервера
	getProductList(): Promise<IProductItem[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProductItem>) =>
			data.items.map((product) => ({
				...product,
				image: this.cdn + product.image,
			}))
		);
	}
	// отправка информации о заказе на сервер
	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

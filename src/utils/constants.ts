export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	// название валюты в родительском падеже
	currency: 'синапсов',
	// сообщения в интерфесе приложения
	messages: {
		// сообщения об обшибках валидации форм
		formErrors: {
			phone: 'Необходимо указать телефон',
			email: 'Необходимо указать email',
			address: 'Необходимо указать адрес доставки',
			payment: 'Необходимо выбрать способ оплаты',
		},
		// тексты в карточке товара
		card: {
			// нет цены. товар не доступен к покупке.
			noprice: 'Бесценно',
		},
		// текст на кнопке "купить" в карточке продукта
		buyButtonValues: {
			add: 'Купить',
			delete: 'Убрать',
			disabled: 'Недоступно',
		},
		// сообщение при успешном оформлении заказа
		success: 'Списано summa синапсов',
		// сообщения в корзине
		basket: {
			empty: 'Корзина пуста',
		},
	},
	// маппинг названия категории продукта с классом оформления категории в верстке
	categoryClasses: {
		другое: 'card__category_other',
		'софт-скил': 'card__category_soft',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	},
};

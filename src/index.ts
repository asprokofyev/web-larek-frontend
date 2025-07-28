import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { Card, categoryTypes } from './components/Card';
import { Modal } from './components/Modal';
import { Contacts, Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import { WebLarekApi } from './components/WebLarekApi';
import { WebLarek } from './components/WebLarekModel';
import './scss/styles.scss';
import { IOrderForm, IProduct, IProductsCatalog } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// инициализация брокера событий
const events = new EventEmitter();
// инициализация каталога продуктов
const appData = new WebLarek({}, events);
// инициализация API
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formStep1Template = ensureElement<HTMLTemplateElement>('#order');
const formStep2Template = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(formStep1Template), events);
const contacts = new Contacts(cloneTemplate(formStep2Template), events);

// бизнес-логика

// products:changed - изменение данных в катлоге товаров > надо перерендерить каталог на странице
events.on<IProductsCatalog>('products:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(productCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category as categoryTypes,
		});
	});

	page.counter = appData.getProductsInBasketCount();
});

// реакция на клик на карточку каталога на странице > надо передать в модель данных приложения id продукта и открыть модалку с просмотром продукта
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(productPreviewTemplate), {
		onClick: () => {
			events.emit('basket:changed', item);
			modal.close();
		},
	});
	card.changeButton(item.price, appData.inBasket(item.id));
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category as categoryTypes,
		}),
	});
});

// реакция на клик на иконку корзины на странице > надо открыть модалку с корзиной
events.on('basket:open', () => {
	basket.items = appData.order.items.map((id, index) => {
		const item = appData.getProduct(id);
		const card = new Card(cloneTemplate(productBasketTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			itemIndex: index + 1,
		});
	});
	basket.total = appData.getTotal();

	modal.render({
		content: basket.render({}),
	});
});

// реакция на клик на кнопку "Купить" / "Убрать" в модалке просмотра продукта > надо добавить / удалить продукт из корзины, обновить страницу чтобы обновилрсь количество продуктов над иконкой корзины
events.on('basket:changed', (item: IProduct) => {
	if (appData.inBasket(item.id)) {
		appData.deleteFromBasket(item.id);
	} else {
		appData.addToBasket(item.id);
	}
});

// реакция на клик на иконку удаления продукта в корзине > убрать продукт из корзины, перерендерить список продуктов в корзине, обновить общую сумму корзины, обновить статус кнопки "Оформить"
events.on('basket:delete', (item: IProduct) => {
	appData.deleteFromBasket(item.id);
	events.emit('basket:open');
});

// 6. реакция на клик на кнопку "Оформить" в корзине > открыть можалку с первым шагом оформления заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: appData.order.payment,
			address: appData.order.address,
			valid: !!appData.order.payment && !!appData.order.address,
			errors: [],
		}),
	});
});

// реакция на клики по кнопкам "Онлайн", "При получении" и на ввод текста в поле "Адрес" > сохранить данные в модель, валидация формы.
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// реакция на изменение состояния валидации формы выбора типа оплаты и ввода адреса доставки
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	order.valid = Object.keys(errors).length > 0 ? false : true;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Далее" в модалке первого шага оформления заказа > открыть модалку со вторым шагом оформления заказа.
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: appData.order.phone,
			email: appData.order.email,
			valid: !!appData.order.phone && !!appData.order.email,
			errors: [],
		}),
	});
});

// реакция на ввод текста в поля "Телефон" и "Email" > сохранить данные в модель, валидация формы.
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);
// реакция на изменение состояния валидации формы ввода номера телефона и email
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	contacts.valid = Object.keys(errors).length > 0 ? false : true;
	contacts.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Оплатить" в модалке второго шага оформления заказа > значит обе формы валидны > отправить заказ на сервер, если все ок, то очистить корзину, открыть модалку успешной оплаты заказа.
events.on('contacts:submit', () => {
	api
		.sendOrder(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
				},
			});

			modal.render({
				content: success.render({ total: result.total }),
			});
		})
		.catch((err) => console.log(err));
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// первоначальная загрузка каталога продуктов
api
	.getProducts()
	.then((data) => {
		appData.setProducts(data);
	})
	.catch((err) => console.log(err));

import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { Contacts, Order } from './components/Order';
import { Page } from './components/Page';
import { ProductsModel } from './components/WebLarekModel';
import { WebLarekApi } from './components/WebLarekApi';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// инициализация брокера событий
const events = new EventEmitter();
// инициализация каталога продуктов
const productsCatalog = new ProductsModel(events);
// инициализация API
const api = new WebLarekApi(API_URL);

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

// 0. изменение данных в катлоге товаров > надо перерендерить каталог на странице

// 1. реакция на клик на карточку каталога на странице > надо открыть модалку с просмотром продукта

// 2. реакция на клик на иконку корзины на странице > надо открыть модалку с корзиной

// 3. реакция на клик на кнопку "Купить" в модалке просмотра продукта > надо добавить продукт в корзину, заменить кнопку на "Убрать"

// 4. реакция на клик на кнопку "Убрать" в модалке просмотра продукта > надо убрать продукт из корзины, заменить кнопку на "Купить"

// 5. реакция на клик на иконку удаления продукта в корзине > убрать продукт из корзины, перерендерить список продуктов в корзине, обновить общую сумму корзины, обновить статус кнопки "Оформить"

// 6. реакция на клик на кнопку "Оформить" в корзине > открыть можалку с первым шагом оформления заказа

// 7. реакция на клики по кнопкам "Онлайн", "При получении" > "выбрать" соответсвующий вид оплаты, т. е. поменять класс у кнопки и запомнить тип оплаты в данных заказа, провалидировать форму.

// 8. реакция на ввод текста в поле "Адрес" > валидация форму.

// 9. реакция на кнопку "Далее" в модалке первого шага оформления заказа > валидация формы, сохранить данные в заказ, открыть модалку со вторым шагом оформления заказа.

// 10. реакция на ввод текста в поля "Телефон" и "Email" > валидация формы.

// 11. реакция на кнопку "Оплатить" в модалке второго шага оформления заказа > валидация формы, сохранить данные в заказ, отправить данные на сервер, если все ок, то очистить корзину, очитить формы оформления заказа, открыть модалку успешной оплаты заказа.

// 12. реакция на кнопку "За новыми покупками!" в модалке успешной оплаты > закрыть модальное окно. 

// первоначальная загрузка каталога продуктов
api
	.getProducts()
	.then((data) => {
		productsCatalog.setProducts(data.items);
	})
	.catch((err) => console.log(err));

/* получение конкретного товара
api
	.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390')
	.then((data) => {
		console.log(data);
	})
	.catch((err) => console.log(err));

// отправка заказа
const orderExample = {
	payment: 'online',
	email: 'test@test.ru',
	phone: '+71234567890',
	address: 'Spb Vosstania 1',
	total: 2200,
	items: [
		'854cef69-976d-4c2a-a18c-2aa45046c390',
		'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
	],
};
api
	.sendOrder(orderExample)
	.then((data) => {
		console.log(data);
	})
	.catch((err) => console.log(err));
*/

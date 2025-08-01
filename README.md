# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```shell
npm install
npm run start
```

или

```shell
yarn
yarn start
```

## Сборка

```shell
npm run build
```

или

```shell
yarn build
```

## Архитектура приложения

Для реализации приложения выбран паттерн MVP c использованием брокера событий. В этом подходе, MVP обеспечивает структуру для разделения ответственности между представлением (View), моделью (Model) и презентатором (Presenter), а брокер событий позволяет компонентам взаимодействовать асинхронно, используя события.

Модель приложения реализована классом `WebLarek` с интерфейсом `IWebLarekState` c использованием базового класса `Model`.

За отображение интерфесвов и взаимодействие с пользователем отвечают классы представления `Page`, `Card`, `Basket`, `Success`, `Order`, `Contacts`. Для отображения форм используется базовый дженерик класс `Form<T>`. Для отображения всех модальных окон используется базовый класс `Modal`. В качестве базового класса для работы с DOM-элементами веб-страниц используется класс `Component<T>` предоставленный в стартовом наборе.

Весь функционал Presenter-а реализован файле - точке входа в приложение `src/index.ts`.

В качестве брокера событий используется класс `EventEmitter` предоставленный в стартовом наборе.

Взаимодействие с серверной частью приложения реализовано за счет расширения базового метода JavaScript `fetch`. Базовый функционал работы с запросами к серверу реализован в классе `Api`, предоставленного в стартовом пакете. Специфический для текущего приложения функционал реализован в классе `WebLarekApi`.

## Константы и настройки приложения

**Файл:** `src/utils/constants.ts` содержит глобальные константы и настройки приложения, включая:

- URL API и CDN
- Текстовые константы для интерфейса
- Настройки валюты
- Классы CSS для категорий товаров

### Константы API

1. **`API_URL`**: Базовый URL для API-запросов. Собирается из переменной окружения `API_ORIGIN` с добавлением пути `/api/weblarek`

```typescript
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
```

2. **`CDN_URL`\***: Базовый URL для доступа к контенту (изображениям, медиа). Собирается из переменной окружения `API_ORIGIN` с добавлением пути `/content/weblarek`

```typescript
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
```

### Объект настроек `settings`

1. **`currency`**: название валюты приложения в родительном падеже.
   _Использование_: Для отображения в интерфейсе (например, "Списано 100 синапсов")

2. **`messages`**: тексты используемые в интерфейсе приложения

   2.1. **`formErrors`**: сообщения об ошибках валидации для различных полей формы

   ```typescript
   phone: 'Необходимо указать телефон',
   email: 'Необходимо указать email',
   address: 'Необходимо указать адрес доставки',
   payment: 'Необходимо выбрать способ оплаты',
   ```

   2.2. **`card`**: тексты в карточке товаров

   ```typescript
   noprice: 'Бесценно'; // замена для цены 0.
   ```

   2.3. **`buyButtonValues`**: тексты для кнопки покупки в разных состояниях

   ```typescript
   add: 'Купить',
   delete: 'Убрать',
   disabled: 'Недоступно',
   ```

   2.4. **`success`**: шаблон сообщения об успешном заказе. _Примечание_: `summa` будет заменено на фактическую сумму.

   ```typescript
   success: 'Списано summa синапсов';
   ```

   2.5. **`basket`**: тексты в окне корзины

   ```typescript
   empty: 'Корзина пуста'; // сообщение при пустой корзине вместо списка продуктов
   ```

3. **`categoryClasses`**: маппинг названий категорий на CSS-классы для стилизации, где

- Ключ: название категории из API
- Значение: соответствующий CSS-класс

```typescript
'другое': 'card__category_other',
'софт-скил': 'card__category_soft',
'дополнительное': 'card__category_additional',
'кнопка': 'card__category_button',
'хард-скил': 'card__category_hard',
```

### Особенности

- Все текстовые константы собраны в одном месте для удобства локализации
- Настройки стилей категорий централизованы для согласованности интерфейса
- URL API и CDN конфигурируются через переменные окружения

## Ключевые типы данных

**Файл**: `src/types/index.ts` содержит все основные типы данных и интерфейсы, используемые в приложении. Разделен на три основные категории:

1. Модельные типы (Model) - описывают структуру данных приложения
2. Типы представления (View) - описывают структуры для работы с UI
3. API типы - описывают структуры для работы с API

### Модельные типы (Model)

1. **IProduct`**: описывает структуру данных продукта.

```typescript
export interface IProduct {
	id: string; // уникальный идентификатор
	title: string; // название продукта
	category: string; // категория продукта
	description: string; // описание продукта
	image: string; // путь к изображению
	price: number; // цена продукта
}
```

2. **`IProductsCatalog`**: описывает каталог продуктов как массив `IProduct`

```typescript
export interface IProductsCatalog {
	items: IProduct[];
}
```

3. **`IWebLarekState`**: главный интерфейс состояния приложения

```typescript
export interface IWebLarekState {
	// массив продуктов, с которым работает приложение
	catalog: IProduct[];
	// id продукта для просмотра в модальном окне
	preview: string | null;
	// данные текущего заказа: корзина + данные клиента
	order: IOrder | null;
	// ошибки валидации форм
	formErrors: FormErrors;

	// сохранить данные каталога полученные из api
	setProducts(items: IProduct[]): void;
	// возвращает данные конкретного продукта
	getProduct(id: string): IProduct;
	// добавить продукт в корзину
	addToBasket(id: string): void;
	// удалить продукт из корзины
	deleteFromBasket(id: string): void;
	// проверить наличие продукта в корзине
	inBasket(id: string): boolean;
	// посчитать количество продуктов в корзине
	getProductsInBasketCount(): number;
	// посчитать общую стоимость продуктов корзины/заказа
	getTotal(): number;
	// очистить корзину/заказ после успешной отправки на сервер
	clearBasket(): void;
	// заполнение полей заказа из формы выбора типа оплаты и ввода адреса доставки
	setOrderField(field: keyof IOrderForm, value: string): void;
	// заполнение полей заказа из формы ввода номера телефон и email-a
	setContactsField(field: keyof IOrderForm, value: string): void;
	// проврека формы выбора типа оплаты и ввода адреса доставки
	validateOrder(): void;
	// проврека формы выбора ввода номера телефон и email-a
	validateContacts(): void;
	// установить id выбранного к просмотру в модальном окне продукта
	setPreview(item: IProduct): void;
}
```

4. **`IOrderForm`**: данные формы заказа, вводимые пользователем

```typescript
export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}
```

5. **`IOrder`**: полные данные заказа, включая продукты и итоговую сумму

```typescript
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

6. **`FormErrors`**: тип для ошибок валидации формы заказа

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

### Типы представления (View)

1. **`IPage`**: описывает состояние страницы

```typescript
export interface IPage {
	products: HTMLElement[]; // массив HTML-элементов карточек товаров
	locked: boolean; // флаг блокировки страницы при открытом модальном окне
	counter: number; // счетчик товаров в корзине
}
```

2. **`IBasketView`**: состояние представления корзины

```typescript
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}
```

3. **`ICard`**: описывает карточку товара

```typescript
export interface ICard {
	id: string;
	title: string;
	description?: string;
	image?: string;
	price: number;
	itemIndex: number;
	category?: categoryTypes;
	changeButton(price: number, inBasket: boolean): void; // обновляет состояние кнопки покупки
}
```

4. **`ICardActions`**: действия для карточки товара

```typescript
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
```

5. **`ISuccess`** и **`ISuccessActions`**: описывают окно успешного оформления заказа

```typescript
export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
```

6. **`IModalData`**: данные для модального окна

```typescript
export interface IModalData {
	content: HTMLElement;
}
```

7. **`categoryTypes`**: возможные категории товаров

```typescript
export type categoryTypes =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
```

### API типы

1. **`IWebLarekApi`**: интерфейс API приложения

```typescript
export interface IWebLarekApi {
	getProducts: () => Promise<IProduct[]>; // получение списка товаров
	getProduct: (id: string) => Promise<IProduct>; // получение конкретного товара
	sendOrder: (data: Partial<IOrder>) => Promise<IOrderAnswer>; // отправка заказа
}
```

2. **`IProductsCatalogData`**: ответ API для каталога товаров с общим количеством

```typescript
export interface IProductsCatalogData extends IProductsCatalog {
	total: number;
}
```

3. **`IOrderAnswer`**: ответ API после оформления заказа

```typescript
export interface IOrderAnswer {
	id: string;
	total: number;
}
```

### Взаимосвязи типов

```mermaid
graph TD
    IWebLarekState --> IProduct
    IWebLarekState --> IOrder
    IOrder --> IOrderForm
    IProductsCatalog --> IProduct
    IProductsCatalogData --> IProductsCatalog
    ICard --> categoryTypes
    IWebLarekApi --> IProduct
    IWebLarekApi --> IOrder
    IWebLarekApi --> IOrderAnswer
```

## Базовый код

### Класс `API`

**Файл**: `src/components/base/api.ts`.

Реализует базовый функционал обмена данными с серверной частью приложения средствами javascript.

Класс имеет методы:

- `get` - выполнение GET-запросов к серверу,
- `post` - выполнение POST, PATCH, DELETE запросов к серверу,
- `handleResponse` - базовая проверка ответа от сервера и привидение его к требуемому типу.

Для начала работы с сервером при инициализации экземпляра класса необходимо передать адрес сервера в обязательном параметре `baseUrl` и при необходимости дополнительные парметры в `options`.

### Класс `Component<T>`

**Файл**: `src/components/base/Component.ts`.

Класс содержит базовые методы для работы с любыми HTML-элементами страницы и используется во всех класса представления (View):

1. **Переключить класс**

```typescript
toggleClass(element: HTMLElement, className: string, force?: boolean)
```

2. **Установить текстовое содержимое**

```typescript
setText(element: HTMLElement, value: unknown)
```

3. **Сменить статус блокировки**

```typescript
setDisabled(element: HTMLElement, state: boolean)
```

4. **Скрыть элемент**

```typescript
setHidden(element: HTMLElement)
```

5. **Показать элемент**

```typescript
setVisible(element: HTMLElement)
```

6. **Установить изображение с алтернативным текстом**

```typescript
setImage(element: HTMLImageElement, src: string, alt?: string)
```

7. **Вернуть корневой DOM-элемент**

```typescript
render(data?: Partial<T>): HTMLElement
```

### Класс `EventEmitter`

**Файл**: `src/components/base/event.ts`.

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы `on`, `off`, `emit` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков.

Интересным дополнением является метод `trigger`, генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

### `Model<T>`

**Файл**: `src/components/base/Model.ts`.

Базовый абстрактный класс `Model<T>` предоставляет фундаментальную функциональность для работы с моделями данных в TypeScript-приложении. Он служит для:

1. Различения моделей от простых объектов данных
2. Предоставления общего интерфейса для работы с событиями моделей
3. Создания основы для конкретных моделей данных в приложении

Файл содержит Type Guard `isModel`, который проверяет, является ли переданный объект экземпляром класса Model.

```typescript
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};
```

А также сам обстрактный класс с описанным конструктором и одним общим для всех моделей методом `emitChanges`. Реализация класса изначально подразумевает, что модель будет работать с брокером событий.

1. **Конструктор**:

```typescript
constructor(data: Partial<T>, protected events: IEvents)
```

Параметры:

- `data: Partial<T>` - начальные данные для модели (частичные, так как могут быть не все поля)
- `events: IEvents` - объект для работы с событиями.

2. **Метод `emitChanges`**: используется для уведомления подписчиков об изменениях в модели.

```typescript
emitChanges(event: string, payload?: object): void
```

Параметры:

- `event: string` - название события
- `payload?: object` - дополнительные данные события (по умолчанию - пустой объект)

## Модель данных (бизнес-логика)

### Класс WebLarek

**Файл**: `src/components/WebLarekModel.ts`.

Класс `WebLarek` содержит состояние всего приложения и управляет этим состоянием. Класс управляет каталогом товаров, корзиной покупок и процессом оформления заказа.

```typescript
export class WebLarek extends Model<IWebLarekState>
```

Класс наследуется от базового класса `Model` с указанием типа состояния `IWebLarekState`.

#### Свойства

1. `catalog: IProduct[]`
   Массив товаров каталога магазина.

2. `order: IOrder`
   Объект, содержащий информацию о текущем заказе:

- `email`: string - email покупателя
- `phone`: string - телефон покупателя
- `payment`: string - способ оплаты
- `address`: string - адрес доставки
- `items`: string[] - массив идентификаторов товаров в корзине
- `total`: number - общая сумма заказа

3. `preview: string | null`
   Идентификатор товара, который в данный момент просматривается в модальном окне (или null, если ничего не просматривается).

4. `formErrors: FormErrors`
   Объект, содержащий ошибки валидации форм.

#### Методы

1. `setProducts(items: IProduct[]): void`
   Сохраняет данные каталога, полученные из API.

- `items` - массив товаров
- Генерирует событие `'products:changed'`, т.к. после загрузки каталога с сервера необходимо перерисовать главную страницу

2. `getProduct(id: string): IProduct`
   Возвращает данные конкретного товара по его идентификатору.

- `id` - идентификатор товара
- Возвращает объект товара или undefined, если товар не найден

3. `addToBasket(id: string): void`
   Добавляет товар в корзину.

- `id` - идентификатор товара
- Обновляет общую сумму заказа
- Генерирует событие `'products:changed'`, т.к. после добавления продукта в корзину необходимо обновить главную страницу, чтобы иземлось количество продуктов над иконкой корзины.

4. `deleteFromBasket(id: string): void`
   Удаляет товар из корзины.

- `id` - идентификатор товара
- Обновляет общую сумму заказа
- Генерирует событие `'products:changed'`, т.к. после удаления продукта из корзины необходимо обновить главную страницу, чтобы иземлось количество продуктов над иконкой корзины.

5. `inBasket(id: string): boolean`
   Проверяет наличие товара в корзине.

- `id` - идентификатор товара
- Возвращает `true`, если товар есть в корзине, иначе `false`

6. `getProductsInBasketCount(): number`
   Возвращает количество товаров в корзине.

7. `getTotal(): number`
   Вычисляет общую стоимость товаров в корзине.

8. `clearBasket(): void`
   Очищает корзину после успешного оформления заказа.

- Сбрасывает все поля заказа
- Генерирует событие `'products:changed'`, т.к. после очистки корзины необходимо обновить главную страницу, чтобы иземлось количество продуктов над иконкой корзины.

9. `setOrderField(field: keyof IOrderForm, value: string): void`
   Устанавливает значение поля заказа (шаг 1 оформления).

- `field` - название поля ('payment' или 'address')
- `value` - значение поля
- Вызывает валидацию формы заказа

10. `setContactsField(field: keyof IOrderForm, value: string): void`
    Устанавливает значение поля контактов (шаг 2 оформления).

- `field` - название поля ('email' или 'phone')
- `value` - значение поля
- Вызывает валидацию формы контактов

11. `validateOrder(): void`
    Проверяет валидность формы выбора способа оплаты и ввода адреса доставки.

- Устанавливает ошибки в `formErrors`
- Генерирует событие `'orderFormErrors:change'` с текущими ошибками, чтобы отобразить их в форме.

12. `validateContacts(): void`
    Проверяет валидность формы ввода контактных данных.

- Устанавливает ошибки в `formErrors`
- Генерирует событие `'contactsFormErrors:change'` с текущими ошибками, чтобы отобразить их в форме.

13. `setPreview(item: IProduct): void`
    Устанавливает продукт для просмотра в модальном окне.

- `item` - объект товара
- Устанавливает `preview` в ID товара
- Генерирует событие `'preview:changed'` с данными продукта, чтобы открыть окно просмотра продукта.

## Компоненты представления

Все методы работы с HTML-элементами веб-страницы реализованы на базовом классе `Component`.

Поэтому все классы представления описанные ниже по сути реализрована по одной и той же схеме:

1. в конструкторе класса по идентификатору или css-классу находятся объекты веб-страницы, за отображение которых отвечает данный класс.
2. также в конструкторе назначаются необходимые слушатели событий.
3. измения данных в HTML-элемнтах реализованы через соответсвующие сеттеры.

### Класс `Page`

**Файл**: `src/components/Page.ts`.

Класс `Page` представляет собой компонент для управления основным отображением страницы приложения. Наследуется от базового класса `Component` и реализует интерфейс `IPage`.

#### Обрабатываемые элементы (свойства класса)

Класс работает со следующими элементами страницы:

- **\_counter**: HTMLElement - элемент для отображения количества товаров в корзине
- **\_catalog**: HTMLElement - контейнер для элементов каталога
- **\_wrapper**: HTMLElement - обертка страницы (используется для блокировки прокрутки)
- **\_basket**: HTMLElement - кнопка/иконка корзины

#### Методы класса

Для изменения данных элемнтов реализованы следующие методы (сеттеры):

1. **counter**: устанавливает значение счетчика товаров в корзине.

```typescript
set counter(value: number): void
```

Параметры:

- `value: number` - новое значение счетчика

2. **catalog**: обновляет содержимое каталога.

```typescript
set catalog(items: HTMLElement[]): void
```

Параметры:

- `items: HTMLElement[]` - массив DOM-элементов для отображения в каталоге

3. **locked**: блокирует или разблокирует прокрутку страницы.

```typescript
set locked(value: boolean): void
```

Параметры:

- `value: boolean` - флаг блокировки (true - заблокировать, false - разблокировать)

#### Устанавливаемые слушатели событий

При создании экземпляра класса на элемент `_basket` добавляется обработчик клика, который инициирует событие `'basket:open'` через систему событий.

### Класс `Modal`

**Файл**: `src/components/Modal.ts`.

Класс `Modal` представляет собой компонент для управления основным отображением страницы приложения. Наследуется от базового класса `Component` и реализует интерфейс `IModalData`.

#### Обрабатываемые элементы (свойства класса)

Класс работает со следующими элементами страницы:

- **\_content**: HTMLElement - контейнер для содержания модального окна
- **\_closeButton**: HTMLButtonElement - кнопка закрытия окна

#### Методы класса

Для изменения данных элемнтов реализованы следующие методы:

1. сеттер **content**: обновляет содержимое окна.

```typescript
set content(value: HTMLElement)
```

Параметры:

- `value: HTMLElement` - DOM-элемент для отображения в окне

2. **open**: открывает модальное окно. Генерирует событие `modal:open`, по которому происходит блокировка скроллинга страницы.

```typescript
open();
```

3. **close**: очищает от контента и закрывает модальное окно. Генерирует событие `modal:close`, по которому происходит разблокировка скроллинга страницы.

```typescript
close();
```

4. **render**: возвращает корневой DOM-элемент. Переопреденный метод базового класса, т.к. кроме возврата корневого элемента надо еще открыть модальное окно методом `open`.

```typescript
render(data: IModalData): HTMLElement
```

#### Устанавливаемые слушатели событий

При создании экземпляра на элемент `_closeButton` и `container` добавляется обработчик клика, который закрывет модальное окно.

### Класс `Form<T>`

**Файл**: `src/components/Form.ts`.

Абстрактный класс `Form<T>` предоставляет базовую функциональность для работы с формами в приложении. Наследуется от класса `Component` и реализует общую логику для:

- Обработки пользовательского ввода
- Валидации формы
- Отображения ошибок
- Отправки данных

Выделение базовой функциональности работы с формами в абстракный класс обусловлено наличием общей для всех форм и их полей функцилнальностью:

- использование джененрик типа позволяет типизировать все поля формы, что обеспечивает безовасность при работе с данными формы,
- интеграция с брокером событий, что позволяет отделить логику валидации от представления
- метод `render` принимает как данные формы, так и состояние валидации, что позволяет единообразно обновлять все аспекты формы
- подписка на события input и submit настраивается автоматически. Не требует дополнительной настройки в наследующих классах
- интеграция с базовым `Component` наследует базовую функциональность компонента и добавляет специфичное для форм поведение

#### Свойства

- `_submit: HTMLButtonElement` - кнопка отправки формы
- `_errors: HTMLElement` - контейнер для отображения ошибок

#### Методы

1. **`onFieldChange`**: обрабатывает изменения в полях формы и генерирует соответствующие события.

```typescript
protected onFieldChange(field: keyof T, value: string): void
```

Параметры:

- `field: keyof T` - имя измененного поля
- `value: string` - новое значение поля
  Генерирует событие:
  `${formName}.${fieldName}:change` с данными `{ field, value }`

2. сеттер **`valid`**: управляет состоянием кнопки отправки формы.

```typescript
set valid(value: boolean): void
```

Параметры:

- `value: boolean` - флаг валидности формы (true - форма валидна)

3. сеттер **`errors`**: устанавливает текст ошибок формы.

```typescript
set errors(value: string): void
```

Параметры:

- `value: string` - текст ошибки(ок) для отображения

4. **`render`**: обновляет состояние формы и возвращает DOM-элемент.

```typescript
render(state: Partial<T> & IFormState): HTMLFormElement
```

Параметры:

- `state: Partial<T> & IFormState` - объект состояния формы:
  - `valid: boolean` - флаг валидности
  - `errors: string` - текст ошибок
  - остальные поля формы типа T

Возвращает `HTMLFormElement` - DOM-элемент формы

#### Обработчики событий

1. **input**:

   - Отслеживает изменения в полях ввода
   - Для каждого изменения генерирует событие через `onFieldChange`

2. **submit**:
   - Перехватывает стандартное поведение формы
   - Генерирует событие `${formName}:submit`

### Классы `Order` и `Contacts`

**Файл**: `src/components/Order.ts`.

Особенностью работы с формами оформления заказа, является то что, если пользователь прерывает оформление заказа (специально или случайно), данные, которые он успел ввести в поля формы сохраняются в моделе приложения и будут использованы при отображении форм при последующем их открытии.

Поля форм сбрасываются только после успешного оформления заказа.

#### Класс `Order`

Класс `Order` наследуется от базового класса `Form` и реализует специфичную логику для первого шага оформления заказа - выбора способа оплаты и ввода адреса доставки.

#### Обрабатываемые элементы (свойства класса)

- `_buttonOnline: HTMLButtonElement` - кнопка выбора онлайн-оплаты
- `_buttonCash: HTMLButtonElement` - кнопка выбора оплаты при получении

Для доступа к полям формы используется `elements.namedItem()`.

#### Методы класса

1. сеттер **`payment`**: устанавливает выбранный способ оплаты и обновляет визуальное состояние кнопок.

```typescript
set payment(value: string): void
```

Параметры:

- `value: string` - название выбранного способа оплаты ('online' или 'cash on delivery')

2. **`address`**: устанавливает значение поля адреса доставки.

```typescript
set address(value: string): void
```

Параметры:

- `value: string` - адрес доставки

#### Обрабатываемые события (кроме реализованных в базовом классе `Form`)

1. **Клик по кнопке онлайн-оплаты**:

   - Активирует визуальное состояние кнопки
   - Деактивирует кнопку "При получении"
   - Генерирует событие изменения поля 'payment'

2. **Клик по кнопке оплаты при получении**:
   - Активирует визуальное состояние кнопки
   - Деактивирует кнопку "Онлайн"
   - Генерирует событие изменения поля 'payment'

#### Класс `Contacts`

Класс `Contacts` наследуется от базового класса `Form` и реализует специфичную логику для второг шага оформления заказа - ввода контактных данных клиента.

#### Обрабатываемые элементы (свойства класса)

Свойств у класса нет.

Для доступа к полям формы используется `elements.namedItem()`.

#### Методы класса

1. сеттер **`phone`**: устанавливает значение поля "Телефон".

```typescript
set phone(value: string): void
```

Параметры:

- `value: string` - номер телефона клиента

2. сеттер **`email`**: устанавливает значение поля "Email".

```typescript
set email(value: string): void
```

Параметры:

- `value: string` - email клиента

### Класс `Card`

**Файл**: `src/components/Card.ts`.

Класс `Card` представляет компонент для отображения карточки товара в различных контекстах приложения. Наследуется от базового класса `Component` и реализует три варианта отображения:

1. Карточка товара в каталоге на странице
2. Карточка товара в модальном окне просмотра
3. Карточка товара в корзине

#### Обрабатываемые элементы (свойства класса)

- `_title: HTMLElement` - элемент заголовка карточки
- `_image?: HTMLImageElement` - элемент изображения товара (опционально)
- `_description?: HTMLElement` - элемент описания товара (опционально)
- `_category?: HTMLElement` - элемент категории товара (опционально)
- `_button?: HTMLButtonElement` - кнопка "Купить"/"Убрать" (опционально)
- `_price: HTMLElement` - элемент цены товара
- `_itemIndex?: HTMLElement` - элемент номера товара в корзине (опционально)

#### Методы

1. сеттер **`id`**: управляет data-атрибутом id карточки

```typescript
set id(value: string): void
```

2. сеттер **`title`**: устанавливает текст заголовка карточки.

```typescript
set title(value: string): void
```

3. сеттер **`description`**: устанавливает текст описания товара.

```typescript
set description(value: string): void
```

4. сеттер **`category`**: устанавливает категорию товара и добавляет соответствующий CSS-класс для стилизации.

```typescript
set category(value: categoryTypes): void
```

Маппинг названий категорий и css-классов находится в настройках приложения `settings.categoryClasses` и работает за счет типа `categoryTypes`.

5. сеттер **`price`**: устанавливает цену товара с форматированием. Если цена равна 0, отображается сообщение "Бесценно" и кнопка отключается. Текст сообщения берется из настроек приложения `settings.messages.card.noprice`.

```typescript
set price(value: number): void
```

6. сеттер **`image`**: устанавливает изображение товара с alt-текстом равным заголовку.

```typescript
set image(value: string): void
```

7. сеттер **`itemIndex`**: устанавливает номер позиции товара в корзине.

```typescript
set itemIndex(value: number): void
```

8. **`changeButton`**: обновляет состояние и текст кнопки "Купить" в зависимости от цены и наличия товара в корзине. Тексты для кнопки содержатся в настройках приложения `settings.messages.buyButtonValues`

```typescript
changeButton(price: number, inBasket: boolean): void
```

Параметры:

- `price: number` - цена товара
- `inBasket: boolean` - флаг наличия товара в корзине

#### Обработчики событий

При создании экземпляра карточки, если передан обработчик `actions.onClick`, он добавляется:

- На кнопку (если она есть в шаблоне)
- Или на весь контейнер карточки (если кнопки нет)

#### Используемые типы и интерфейсы:

- `ICard` - описывает структуру данных карточки товара
- `ICardActions` - описывает доступные действия с карточкой
- `categoryTypes` - возможные категории товаров

### Класс `Basket`

**Файл**: `src/components/Basket.ts`.

Класс `Basket` представляет компонент корзины товаров в приложении. Наследуется от базового класса `Component` и реализует функционал для отображения списка товаров и общей суммы заказа.

#### Обрабатываемые элементы (свойства класса)

- `_list: HTMLElement` - контейнер для списка товаров
- `_total: HTMLElement` - элемент для отображения общей суммы
- `_button: HTMLElement` - кнопка оформления заказа

#### Методы

1. сеттер **`items`**: устанавливает список товаров в корзине.

```typescript
set items(items: HTMLElement[]): void
```

Параметры:

- `items: HTMLElement[]` - массив DOM-элементов товаров

Если передан пустой массив, отображает сообщение о пустой корзине, которое бетерся из настроек приложения `settings.messages.basket.empty`.
В зависимости от наличия товаров в корзине, автоматически активирует/деактивирует кнопку оформления заказа

2. сеттер **`total`**: устанавливает общую сумму заказа.

```typescript
set total(total: number): void
```

Параметры:

- `total: number` - сумма заказа

#### Обработчики событий

При клике на кнопку оформления заказа генерирует событие `order:open`, по которому в презентере открывается окно с формой первого шага оформления заказа.

### Класс `Success`

**Файл**: `src/components/Success.ts`.

Класс `Success` реализует компонент отображения окна успешного оформления заказа. Наследуется от базового класса `Component`.

#### Обрабатываемые элементы (свойства класса)

- `_close: HTMLElement` - кнопка закрытия окна
- `_total: HTMLElement` - элемент для отображения итоговой суммы

#### Методы

1. сеттер **`total`**: устанавливает итоговую сумму заказа в сообщении. Для формирования сообщения используется шаблон из настроек приложения `settings.messages.success`

```typescript
set total(value: number): void
```

Параметры:

- `value: number` - сумма заказа (форматируется автоматически)

#### Обработчики событий

При клике на кнопку закрытия вызывает переданный обработчик:

```typescript
actions.onClick;
```

В текущей реализации обработчик просто закрывает окно.

## Презентер

**Файл**: `src/index.ts`.

Данный Presenter реализует паттерн MVP с использованием брокера событий для управления взаимодействием между компонентами приложения. Presenter выступает в роли посредника между Model (данные) и View (отображение), обрабатывая пользовательские действия и обновляя состояние приложения.

### Основные компоненты:

1. **EventEmitter** - брокер событий
2. **Model (WebLarek)** - хранит состояние приложения (каталог, корзина, заказ)
3. **View компоненты** (Page, Modal, Basket, Order и др.) - отвечают за отображение
4. **API (WebLarekApi)** - взаимодействие с сервером
5. **Presenter** (данный файл) - связующее звено, бизнес-логика

### Инициализация

```typescript
// Инициализация основных компонентов
const events = new EventEmitter(); // Брокер событий
const appData = new WebLarek({}, events); // Модель данных
const api = new WebLarekApi(CDN_URL, API_URL); // API клиент

// Инициализация UI компонентов
// главная страница приложения
const page = new Page(document.body, events);
// модальное окно
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
// корзина
const basket = new Basket(cloneTemplate(basketTemplate), events);
// 1 шаг оформления заказа: форма выбора способа оплаты и ввода адреса доставки
const order = new Order(cloneTemplate(formStep1Template), events);
// 2 шаг оформления заказа: форма ввода контактных данных клиента
const contacts = new Contacts(cloneTemplate(formStep2Template), events);
```

### Основные потоки событий

#### 1. Загрузка и отображение каталога продуктов

```typescript
// Загрузка данных
api.getProducts()
   .then((data) => appData.setProducts(data));

// Реакция на изменение каталога
events.on<IProductsCatalog>('products:changed', () => {
  // Рендер карточек товаров
  page.catalog = appData.catalog.map(item => {
    const card = new Card(...);
    return card.render({...});
  });
  // Обновление счетчика корзины
  page.counter = appData.getProductsInBasketCount();
});
```

#### 2. Работа с корзиной

```typescript
// Добавление/удаление товара
events.on('basket:changed', (item: IProduct) => {
	if (appData.inBasket(item.id)) {
		appData.deleteFromBasket(item.id);
	} else {
		appData.addToBasket(item.id);
	}
});

// Открытие корзины
events.on('basket:open', () => {
	basket.items = appData.order.items.map((id, index) => {
		// Рендер товаров в корзине
	});
	basket.total = appData.getTotal();
	modal.render({ content: basket.render() });
});
```

#### 3. Оформление заказа (2 шага)

```typescript
// Шаг 1: Способ оплаты и адрес
events.on('order:open', () => {
  modal.render({
    content: order.render({
      payment: appData.order.payment,
      address: appData.order.address,
      valid: !!appData.order.payment && !!appData.order.address
    })
  });
});

// Валидация формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  order.valid = !Object.keys(errors).length;
  order.errors = Object.values(errors).filter(i => !!i).join('; ');
});

// Шаг 2: Контактные данные
events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
      phone: appData.order.phone,
      email: appData.order.email,
      valid: !!appData.order.phone && !!appData.order.email
    })
  });
});

// Отправка заказа
events.on('contacts:submit', () => {
  api.sendOrder(appData.order)
     .then((result) => {
       const success = new Success(...);
       modal.render({ content: success.render({ total: result.total }) });
       appData.clearBasket();
     });
});
```

### Вспомогательные функции

#### Управление модальным окном

```typescript
events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));
```

### Шаблоны и компоненты

Используемые шаблоны:

- `#card-catalog` - карточка товара в каталоге
- `#card-basket` - карточка товара в корзине
- `#card-preview` - карточка товара в превью
- `#basket` - корзина
- `#order` - форма заказа (шаг 1)
- `#contacts` - форма контактов (шаг 2)
- `#success` - сообщение об успешном заказе

## Компоненты работы с API

### Класс `WebLarekApi`

**Файл**: `src/components/WebLarekApi.ts`.

Класс `WebLarekApi` реализует взаимодействие с серверной частью приложения, предоставляя методы для работы с продуктами и заказами. Наследуется от базового класса `Api` и реализует интерфейс `IWebLarekApi`.

Для начала работы с сервером при инициализации экземпляра класса необходимо передать параметры:

- `cdn: string` - базовый URL CDN для загрузки изображений
- `baseUrl: string` - базовый URL API сервера
- `options?: RequestInit` - дополнительные опции для HTTP-запросов (необязательный)

#### Типы данных и интерфейсы

Класс работает со следующими типами:

- `IProduct` - описание продукта
- `IProductsCatalogData` - структура ответа сервера для каталога
- `IOrder` - данные заказа
- `IOrderAnswer` - ответ сервера на создание заказа
- `IWebLarekApi` - интерфейс API

Строгая типизация всех входных и выходных параметров позволяет выявлять ошибки на этапе компиляции.

#### Методы

1. **`getProducts`**: загружает полный каталог продуктов с сервера.

```typescript
getProducts(): Promise<IProduct[]>
```

Возвращает `Promise<IProduct[]>` - промис с массивом продуктов.
Автоматически добавляет CDN-префикс к URL изображений.
Преобразует структуру ответа сервера (`IProductsCatalogData`) в массив продуктов.

2. **`getProduct()`**: загружает данные одного продукта по его ID.

```typescript
getProduct(id: string): Promise<IProduct>
```

Параметры:

- `id: string` - идентификатор продукта

Возвращает `Promise<IProduct>` - промис с данными продукта.
Автоматически добавляет CDN-префикс к URL изображения.
В текущем проекте не используется, но оставлен для будущего расширения.

3. **`sendOrder()`**: отправляет данные заказа на сервер.

```typescript
sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer>
```

Параметры:

- `data: Partial<IOrder>` - данные заказа (может содержать не все поля)

Возвращает `Promise<IOrderAnswer>` - промис с ответом сервера о созданном заказе.

## Размещение в сети

- Рабочая версия проекта доступна по адресу: https://asprokofyev.github.io/web-larek-frontend/

- Репозиторий проекта: https://github.com/asprokofyev/web-larek-frontend

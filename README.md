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

Подробное описание всех классов и презентера ниже.

## Константы и настройки приложения

**Файл:** `src/utils/constants.ts`

### Назначение

Файл содержит глобальные константы и настройки приложения, включая:

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

**Файл**: `src/types/index.ts`

### Назначение

Файл содержит все основные типы данных и интерфейсы, используемые в приложении. Разделен на три основные категории:

1. Модельные типы (Model) - описывают структуру данных приложения
2. Типы представления (View) - описывают структуры для работы с UI
3. API типы - описывают структуры для работы с API

### Модельные типы (Model)

### `IProduct`

```typescript
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number;
}
```

- **Назначение**: Описывает структуру данных продукта
- **Поля**:
  - `id` - уникальный идентификатор
  - `title` - название продукта
  - `category` - категория/тег продукта
  - `description` - описание продукта
  - `image` - путь к изображению
  - `price` - цена продукта

### `IProductsCatalog`

```typescript
export interface IProductsCatalog {
	items: IProduct[];
}
```

- **Назначение**: Описывает каталог продуктов как массив `IProduct`

### `IWebLarekState`

```typescript
export interface IWebLarekState {
	catalog: IProduct[];
	preview: string | null;
	order: IOrder | null;
	formErrors: FormErrors;
	// ...методы
}
```

- **Назначение**: Главный интерфейс состояния приложения
- **Поля**:
  - `catalog` - массив продуктов
  - `preview` - ID продукта для просмотра в модальном окне
  - `order` - данные текущего заказа
  - `formErrors` - ошибки валидации форм
- **Методы**:
  - Управление каталогом (`setProducts`, `getProduct`)
  - Работа с корзиной (`addToBasket`, `deleteFromBasket`, `inBasket` и др.)
  - Работа с заказом (`setOrderField`, `setContactsField`)
  - Валидация (`validateOrder`, `validateContacts`)

### `IOrderForm`

```typescript
export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}
```

- **Назначение**: Данные формы заказа, вводимые пользователем

### `IOrder`

```typescript
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

- **Назначение**: Полные данные заказа, включая товары и итоговую сумму

### `FormErrors`

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

- **Назначение**: Тип для ошибок валидации формы заказа

## Типы представления (View)

### `IPage`

```typescript
export interface IPage {
	products: HTMLElement[];
	locked: boolean;
	counter: number;
}
```

- **Назначение**: Описывает состояние страницы
- **Поля**:
  - `products` - массив HTML-элементов карточек товаров
  - `locked` - флаг блокировки страницы при открытом модальном окне
  - `counter` - счетчик товаров в корзине

### `IBasketView`

```typescript
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}
```

- **Назначение**: Состояние представления корзины

### `ICard`

```typescript
export interface ICard {
	id: string;
	title: string;
	description?: string;
	image?: string;
	price: number;
	itemIndex: number;
	category?: categoryTypes;
	changeButton(price: number, inBasket: boolean): void;
}
```

- **Назначение**: Описывает карточку товара
- **Метод**:
  - `changeButton` - обновляет состояние кнопки покупки

### `ICardActions`

```typescript
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
```

- **Назначение**: Действия для карточки товара

### `ISuccess` и `ISuccessActions`

```typescript
export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
```

- **Назначение**: Описывают окно успешного оформления заказа

### `IModalData`

```typescript
export interface IModalData {
	content: HTMLElement;
}
```

- **Назначение**: Данные для модального окна

### `categoryTypes`

```typescript
export type categoryTypes =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
```

- **Назначение**: Возможные категории товаров

## API типы

### `IWebLarekApi`

```typescript
export interface IWebLarekApi {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	sendOrder: (data: Partial<IOrder>) => Promise<IOrderAnswer>;
}
```

- **Назначение**: Интерфейс API приложения
- **Методы**:
  - `getProducts` - получение списка товаров
  - `getProduct` - получение конкретного товара
  - `sendOrder` - отправка заказа

### `IProductsCatalogData`

```typescript
export interface IProductsCatalogData extends IProductsCatalog {
	total: number;
}
```

- **Назначение**: Ответ API для каталога товаров с общим количеством

### `IOrderAnswer`

```typescript
export interface IOrderAnswer {
	id: string;
	total: number;
}
```

- **Назначение**: Ответ API после оформления заказа

## Взаимосвязи типов

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

## Использование в проекте

1. Импорт типов:

```typescript
import { IProduct, IWebLarekState, IOrder } from './types';
```

2. Пример реализации:

```typescript
// Создание продукта
const product: IProduct = {
	id: '1',
	title: 'Курс TypeScript',
	category: 'софт-скил',
	description: 'Подробный курс...',
	image: '/images/ts-course.png',
	price: 10000,
};

// Работа с API
class Api implements IWebLarekApi {
	async getProducts(): Promise<IProduct[]> {
		// реализация
	}
}
```

## Базовый код

1. **Класс `API`**

2. **Класс `Component<T>`**

3. **Класс `EventEmitter`**

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы `on`, `off`, `emit` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков.

Интересным дополнением является метод `trigger`, генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

4. **`Model<T>`**

## Модель данных (бизнес-логика)

### Класс WebLarek

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
- Генерирует событие `'products:changed'`

2. `getProduct(id: string): IProduct`
   Возвращает данные конкретного товара по его идентификатору.

- `id` - идентификатор товара
- Возвращает объект товара или undefined, если товар не найден

3. `addToBasket(id: string): void`
   Добавляет товар в корзину.

- `id` - идентификатор товара
- Обновляет общую сумму заказа
- Генерирует событие `'products:changed'`

4. `deleteFromBasket(id: string): void`
   Удаляет товар из корзины.

- `id` - идентификатор товара
- Обновляет общую сумму заказа
- Генерирует событие `'products:changed'`

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
- Генерирует событие `'products:changed'`

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
    Проверяет валидность данных заказа (шаг 1).

- Устанавливает ошибки в `formErrors`
- Генерирует событие `'orderFormErrors:change'` с текущими ошибками

12. `validateContacts(): void`
    Проверяет валидность контактных данных (шаг 2).

- Устанавливает ошибки в `formErrors`
- Генерирует событие `'contactsFormErrors:change'` с текущими ошибками

13. `setPreview(item: IProduct): void`
    Устанавливает товар для просмотра в модальном окне.

- `item` - объект товара
- Устанавливает `preview` в ID товара
- Генерирует событие `'preview:changed'` с данными товара

#### Использование событий

Класс генерирует следующие события:

- `'products:changed'` - при изменении каталога или корзины
- `'orderFormErrors:change'` - при изменении ошибок формы заказа
- `'contactsFormErrors:change'` - при изменении ошибок формы контактов
- `'preview:changed'` - при изменении просматриваемого товара

## Компоненты представления

1. Класс Page

2. Класс Modal

3. Класс Form<T>

4. Класс Order

5. Класс Contacts

6. Класс Card

7. Класс Basket

8. Класс Success

## Презентер `src/index.ts`

## Компоненты работы с API

1. Класс WebLarekApi

## Размещение в сети

Рабочая версия проекта доступна по адресу:

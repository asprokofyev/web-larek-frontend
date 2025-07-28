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

## Архитектура

## Базовый код

1. Класс API

2. Класс Component<T>

3. Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы `on`, `off`, `emit` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков.

Интересным дополнением является метод `trigger`, генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

4. Model<T>

## Компоненты работы с API

1. Класс WebLarekApi

## Компоненты модели данных (бизнес-логика)

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

## Ключевые типы данных

### Основные типы данных

1. **`IProduct`**
   Интерфейс, описывающий данные одного товара:

```typescript
interface IProduct {
	id: string; // Уникальный идентификатор товара
	title: string; // Название товара
	category: string; // Категория/тег товара
	description: string; // Подробное описание товара
	image: string; // URL изображения товара
	price: number; // Цена товара
}
```

2. **`IProductsCatalog`**
   Интерфейс для каталога товаров:

```typescript
interface IProductsCatalog {
	items: IProduct[]; // Массив товаров в каталоге
}
```

3. **`IProductsCatalogData`**
   Расширенный интерфейс для данных каталога из API:

```typescript
interface IProductsCatalogData extends IProductsCatalog {
	total: number; // Общее количество товаров в каталоге
}
```

4. **`IWebLarekState`**
   Интерфейс состояния всего приложения:

```typescript
interface IWebLarekState {
	catalog: IProduct[]; // Текущий каталог товаров
	preview: string | null; // ID товара для просмотра (или null)
	order: IOrder | null; // Данные текущего заказа (или null)
	formErrors: FormErrors; // Ошибки валидации форм
}
```

5. **`IOrderForm`**
   Интерфейс для данных заказа, вводимых пользователем:

```typescript
interface IOrderForm {
	payment: string; // Способ оплаты (например, "card" или "cash")
	email: string; // Email покупателя
	phone: string; // Телефон покупателя
	address: string; // Адрес доставки
}
```

6. **`IOrder`**
   Полный интерфейс заказа:

```typescript
interface IOrder extends IOrderForm {
	items: string[]; // Массив ID товаров в заказе
	total: number; // Общая сумма заказа
}
```

7. **`FormErrors`**
   Тип для ошибок валидации форм:

```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Пример:

```typescript
{
  phone?: string;
  address?: string;
}
```

8. **`IOrderAnswer`**
   Интерфейс ответа от API при успешном оформлении заказа:

```typescript
interface IOrderAnswer {
	id: string; // Уникальный идентификатор заказа
	total: number; // Общая сумма заказа
}
```

### Взаимосвязи типов

1. **Каталог товаров**:

   - `IProduct` → `IProductsCatalog` → `IProductsCatalogData`

2. **Оформление заказа**:

   - `IOrderForm` → `IOrder` (добавляются items и total)
   - `IOrder` используется в `IWebLarekState`

3. **Валидация**:

   - `FormErrors` использует ключи из `IOrder` для описания возможных ошибок

4. **Ответ сервера**:
   - `IOrderAnswer` содержит данные о созданном заказе

## Размещение в сети

Рабочая версия проекта доступна по адресу:

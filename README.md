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
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
 

Для установки и запуска проекта необходимо выполнить команды


npm install
npm run start


или


yarn
yarn start




## Сборка


npm run build


или


yarn build



## Описание интерфейсов

- **IProductItem**: Описывает карточку продукта.

  - id: string
  - description: string
  - image: string
  - title: string
  - category: string
  - price: number

- **IOrderResult**: Описывает ответ сервера на успешный заказ.

  - id: string
  - total: number

-
- **IOrder**: Описывает интерфейс формы заказа.

  - payment: PaymentMethod
  - email: string
  - phone: string
  - address: string
  - total: number
  - items: string[]

  - **IBasketCard**: Описывает интерфейс карточки в корзине.

  - title: string
  - price: number

- **IOrderAddress**: Описывает интерфейс формы оплаты и доставки.

  - payment: PaymentMethod
  - address: string

- **IContactsOrder**: Описывает интерфейс формы контактов.

  - email: string
  - phone: string

- **IAppStateModel**: Описывает интерфейс состояния приложения.

  - catalog: IProductItem[]
  - basket: string[]
  - order: IOrder | null

## Описание базовых классов

### Класс Api

- Осуществляет работу с сервером.
- Отправляет запросы методами get и post для получения и отправки данных.

### Абстрактный Класс Component

- Базовый класс компонента.
- Методы: toggleClass (переключает класс), setDisabled (меняет статус блокировки), render (возвращает корневой DOM-элемент).

### Слой Model

#### Класс AppStateModel

- Наследует Model.
- Методы для отправки в корзину, удаления из корзины, очистки корзины, валидации формы, проверки заполнения полей.

#### Абстрактный класс Model

- Абстрактный базовый класс для создания объекта хранения данных.

### Слой View

#### Класс Page

- Наследуется от класса Component.
- Отрисовывает главную страницу.
- Методы: setCounter (показывает количество товаров в корзине), setCatalog (передает в каталог массив карточек), setLocked (устанавливает класс блокировки прокрутки страницы при открытии модального окна).

#### Класс Card

- Наследуется от класса Component<ICard>.
- Отображает данные о товаре и устанавливает основные свойства карточки товара.

#### Класс Basket

- Наследуется от класса Component.
- Представление корзины приложения.
- Свойства: list (список элементов в корзине), total (общая стоимость товаров), button (кнопка перехода на следующую стадию - оформление заказа).

#### Класс BasketCard

- Наследуется от класса Component.
- Представление карточки товара в корзине.
- Свойства: index (номер продукта в корзине), title (название товара), button (кнопка удаления), price (стоимость).

#### Класс Modal

- Наследуется от класса Component.
- Содержит информацию отображения модального окна.
- Методы открытия и закрытия модального окна.

## Классы и методы

#### Класс Form

- Наследуется от класса Component.
- Описывает базовую форму отправки данных.
- Содержит свойства:
  - submit: HTMLButtonElement;
  - errors: HTMLElement;

#### Класс OrderAddress

- Наследуется от класса Form.
- Устанавливает следующие свойства:
  - payment: PaymentMethod; (способ оплаты)
  - address: string; (адрес доставки)

#### Класс ContactOrder

- Наследуется от класса Form.
- Устанавливает следующие свойства:
  - email: string; (почта для связи)
  - phone: string; (телефон для связи)

#### Класс Success

- Наследуется от класса Component.
- Отображает основную информацию по завершенному заказу.
- Содержит свойства:
  - close: HTMLElement;
  - total: HTMLElement; (общая сумма заказа)

#### Слой presenter

#### Класс EventEmitter

- Несет в себе функции слоя Представления.
- Обеспечивает работу событий приложения.
- Методы:
  - on: Устанавливает обработчик на событие
  - off: Снимает обработчик на событие
  - emit: Инициирует событие с данными
  - onAll: Устанавливает слушатель на все события
  - offAll: Сбрасывает подписки на все события

#### Класс LarekApi

- Обеспечивает работу с конкретными данными с сервера.
- Методы:
  - getProductList: () => Promise<IProductItem[]>; получает информацию по всем доступным товарам
  - getProduct: (id: string) => Promise; получает информацию по конкретному товару
  - orderProducts: (order: IOrder) => Promise; оформление заказа через соответствующий запрос на сервер

#### index.ts

- Является главным файлом приложения.
- Обеспечивает взаимодействие всех компонентов приложения между собой и с внешними источниками данных.


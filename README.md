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

#### Проект следует архитектурному паттерну Model-View-Presenter (MVP), разделяя приложение на три основных слоя:

1. Model (Модель): Отвечает за хранение и управление данными приложения, а также за бизнес-логику.
2. View (Представление): Отображает данные, полученные от Presenter, и взаимодействует с пользователем через пользовательский интерфейс.
3. Presenter: Обрабатывает события пользователя, взаимодействует с моделью для получения и обновления данных, а также передает данные представлению для отображения.
   Взаимодействие:
   Компоненты взаимодействуют через события. Модель генерирует события при изменении данных, Presenter слушает эти события, обновляет модель и передает данные представлению, а представление обновляет пользовательский интерфейс и отправляет события Presenter в ответ на действия пользователя.
   Данные

## Слой Model

### Model<T>: Абстрактный базовый класс для моделей данных.

Конструктор: constructor(data: Partial<T>, protected events: IEvents)

- data: Частичные данные для инициализации модели.
- events: Экземпляр EventEmitter для работы с событиями.

#### Методы:

- emitChanges(event: string, payload?: object): Генерирует событие - event с данными payload.
- AppStateModel: Модель состояния приложения. Наследует Model<IAppStateModel>.
  Конструктор: constructor(data: Partial<IAppStateModel>, events: IEvents)

#### Свойства:

- basket: Product[]: Список товаров в корзине.
- catalog: Product[]: Каталог товаров.
- order: IOrder | null: Данные заказа.
- formErrors: { [key: string]: string }: Ошибки в формах.

#### Методы:

- addProduct(product: Product): Добавляет товар в корзину.
- deleteProduct(id: string): Удаляет товар из корзины по id.
- resetOrder(): Сбрасывает данные заказа.
- resetBasket(): Очищает корзину и сбрасывает заказ.
- getTotalOrder(): Вычисляет общую стоимость заказа.
- setCatalog(products: IProductItem[]): Устанавливает каталог товаров.
- getOrderedProducts(): Возвращает список заказанных товаров.
- productOrdered(product: Product): boolean: Проверяет, заказан ли товар.
- setOrder(): Обновляет данные заказа (общая стоимость, список товаров).
- validateOrder(): Проверяет валидность формы заказа и обновляет formErrors.
- setPaymentMethod(method: PaymentMethod): Устанавливает способ оплаты.
- validateContacts(): Проверяет валидность формы контактов и обновляет formErrors.
- setContactsField(field: string, value: string): Устанавливает значение поля в форме контактов.
- setAddress(address: string): Устанавливает адрес доставки.

## Слой View

Класс Component<T> - базовый класс для создания элементов отвечающих за визуальное представления интерфейса приложения, в том числе контейнеров содержащих данные элементы.

Реализует методы отвечающие за управление свойствами DOM-элементов страницы:

- Конструктор: constructor(container: HTMLElement)
  Принимает HTML-элемент (container), в который будет помещен компонент

- toggleClass(element: HTMLElement, className: string, force?: - boolean): Переключает класс className для элемента element.
- setText(element: HTMLElement, text: any): Устанавливает текстовое содержимое элемента element.
- setDisabled(element: HTMLElement, disabled: boolean): Устанавливает или снимает атрибут disabled для элемента element.
- setHidden(element: HTMLElement): Скрывает элемент element.
- setVisible(element: HTMLElement): Отображает элемент element.
- setImage(element: HTMLImageElement, src: string, alt?: string): Устанавливает атрибуты src и alt для изображения element.
- render(data?: Partial<T>): HTMLElement: Отрисовывает компонент с предоставленными данными и возвращает корневой DOM-элемент.

### Page: Отображает главную страницу. Наследует Component.

- Конструктор: cconstructor(container: HTMLElement, protected events: IEvents)
- container: HTMLElement - HTML-элемент, который будет служить контейнером для страницы.
- events: IEvents - объект для работы с событиями приложения.
  Свойства:

- \_counter: HTMLElement: Элемент счетчика товаров в корзине.
- \_catalog: HTMLElement: Контейнер для каталога товаров.
- \_wrapper: HTMLElement: Обертка страницы.
- \_basket: HTMLElement: Элемент корзины.

#### Методы:

- set counter(count: number): Устанавливает значение счетчика товаров в корзине.
- set catalog(cards: HTMLElement[]): Отображает карточки товаров в каталоге.
- set locked(locked: boolean): Блокирует прокрутку страницы, если locked равно true.

### Card: Отображает карточку товара. Наследует Component<ICard>.

constructor(blockName: string, container: HTMLElement, events: ICardActions)

- Создает карточку товара.
  Принимает:
- blockName: Название класса для стилей карточки.
- container: HTML-элемент для размещения карточки.
- events: Объект с обработчиками действий карточки

#### Свойства:

- \_title: HTMLElement: Элемент заголовка карточки.
- \_image: HTMLImageElement: Элемент изображения.
- \_description: HTMLElement: Элемент описания.
- \_button: HTMLButtonElement: Элемент кнопки.
- \_price: HTMLElement: Элемент цены.
- \_category: HTMLElement: Элемент категории.

#### Методы:

- set title(title: string): Устанавливает заголовок карточки.
- set image(src: string): Устанавливает изображение карточки.
- set description(text: string): Устанавливает описание карточки.
- set buttonText(text: string): Устанавливает текст кнопки.
- get price(): number: Возвращает цену товара.
- set price(price: number): Устанавливает цену товара.
- set category(category: string): Устанавливает категорию товара и добавляет соответствующий класс.

### Basket: Представление корзины. Наследует Component.

constructor(container: HTMLElement, events: EventEmitter) container - HTML элемент, в который будет встроен компонент корзины. events - экземпляр EventEmitter, используемый для обработки событий.

#### Свойства:

- \_list: HTMLElement: Список товаров в корзине.
- \_total: HTMLElement: Элемент общей стоимости.
- \_button: HTMLButtonElement: Кнопка оформления заказа.
- items: HTMLElement[]: Список карточек товаров в корзине.

#### Методы:

- toggleButton(disabled: boolean): Активирует/деактивирует кнопку оформления заказа.
- set items(items: HTMLElement[]): Отображает карточки товаров в корзине.
- set total(total: number): Устанавливает общую стоимость товаров.

### BasketCard: Представление карточки товара в корзине. Наследует Component.

constructor(idx: number, container: HTMLElement, events: ICardActions) - Создает карточку товара для корзины.
Принимает:
idx: Номер карточки в списке корзины.
container: HTML-элемент для размещения карточки.
events: Объект с обработчиками действий карточки
Свойства:

- \_index: HTMLElement: Номер товара в корзине.
- \_title: HTMLElement: Название товара.
- \_button: HTMLButtonElement: Кнопка удаления.
- \_price: HTMLElement: Цена товара.

#### Методы:

- set title(title: string): Устанавливает название товара.
- set price(price: number): Устанавливает цену товара.
- set index(index: number): Устанавливает номер товара в корзине.

### Modal: Представление модального окна. Наследует Component.

Конструктор: constructor(container: HTMLElement, events: IEvents) - container - HTML элемент модального окна. events - экземпляр IEvents, используемый для обработки событий.

Свойства:

- \_closeButton: HTMLButtonElement: Кнопка закрытия окна.
- \_content: HTMLElement: Контейнер для содержимого окна.

#### Методы:

- set content(content: HTMLElement | null): Устанавливает содержимое окна.
- open(): Открывает модальное окно.
- close(): Закрывает модальное окно.
- render(data: { content: HTMLElement }): HTMLElement: Отрисовывает окно с содержимым и возвращает корневой DOM-элемент.

#### Классы и методы

### Form: Базовый класс для форм. Наследует Component.

Конструктор: constructor(container: HTMLFormElement, events: IEvents) - container - HTML элемент формы. events - экземпляр IEvents, используемый для обработки событий.

##### Свойства:

- \_submit: HTMLButtonElement: Кнопка отправки формы.
- \_errors: HTMLElement: Контейнер для сообщений об ошибках.

#### Методы:

- onInputChange(name: string, value: string): Обрабатывает изменение значения поля формы.
- set valid(valid: boolean): Устанавливает доступность кнопки отправки в зависимости от валидности формы.
- set errors(errors: string): Отображает сообщения об ошибках.
- render(data: { valid?: boolean, errors?: string, [key: string]: any }): HTMLFormElement: Отрисовывает форму с данными и возвращает корневой DOM-элемент.
- OrderAddress: Форма оплаты и доставки. Наследует Form.
  Конструктор: constructor(container: HTMLFormElement, events: IEvents)

#### Методы:

- setButtonClass(name: string): Устанавливает класс - button_alt-active для выбранной кнопки оплаты.
- set address(address: string): Устанавливает значение поля адреса.
- ContactOrder: Форма контактов. Наследует Form.
  Конструктор: constructor(container: HTMLFormElement, events: IEvents)
  Свойства:
  phoneInput: HTMLInputElement: Поле ввода телефона.
  emailInput: HTMLInputElement: Поле ввода email.

#### Методы:

- set phone(phone: string): Устанавливает значение поля телефона.
- set email(email: string): Устанавливает значение поля email.

### Success: Отображает информацию о завершенном заказе. Наследует Component.

Конструктор: constructor(container: HTMLElement, total: number, actions: ISuccessActions) - создает сообщение об успешном заказе с информацией о списанной сумме и кнопкой для закрытия. Функция, обрабатывающая клик на кнопку, передается через объект actions.

##### Свойства:

- \_total: HTMLElement: Элемент с общей суммой заказа.
- \_close: HTMLElement: Кнопка закрытия окна.
  Методы: (наследует от Component)

## Слой Presenter

#### 1. Класс Api - базовый класс осуществляющий обмен данными с сервером через запросы(GET, POST).

constructor(baseUrl: string, options: RequestInit = {}) - Этот конструктор создает новый экземпляр класса Api, который используется для выполнения HTTP-запросов к серверу.

###### Реализует методы:

- get - передача запроса методом GET;
- post - передача запроса методом POST;
- handleResponse - парсинг ответа сервера.

#### 2. Класс LarekAPI - потомок класса Api, предназначен для обмена данными между сервером и моделью данных приложения.

constructor(cdn: string, baseUrl: string, options?: RequestInit) - Этот конструктор создает новый экземпляр класса LarekAPI, который наследует от класса Api и предназначен для взаимодействия с API магазина Larek.

##### Список методов:

- getProduct - запрос информации о продукте;
- getProductList - запрос информации о списке продуктов;
- orderProducts - отправка информации по заказу на сервер.

#### 3. Класс EventEmitter: Обеспечивает работу событий приложения. Реализует интерфейс IEvents.

constructor() { this.\_events = new Map<EventName, Set<Subscriber>>(); } - Этот конструктор создает новый экземпляр класса EventEmitter, который отвечает за управление событиями в приложении.

##### Список методов:

- on<T extends object>(eventName: EventName, callback: (event: T) => void): Подписывается на событие с именем eventName и вызывает callback при возникновении события.
- off(eventName: EventName, callback: Subscriber): Отписывается от события eventName для функции callback.
- emit<T extends object>(eventName: string, data?: T): Генерирует событие eventName с данными data.
- onAll(callback: (event: EmitterEvent) => void): Подписывается на все события.
- offAll(): Отписывается от всех событий.
- trigger коллбек триггер, генерирующий событие при вызове.

### В index.ts описаны основные события и их обработчики:

#### 1. Отображение каталога

Событие catalog:change генерируется при изменении каталога товаров.
Обработчик события создает карточки товаров (Card) на основе данных из модели и отображает их на странице (page.catalog).
Также обновляется счетчик товаров в корзине.

##### 2. Предварительный просмотр товара

Событие preview:change генерируется при клике на карточку товара.
Обработчик события создает карточку товара с подробной информацией (Card) и отображает ее в модальном окне.
Кнопка на карточке товара позволяет добавить или удалить товар из корзины.

#### 3. Добавление/удаление товара в корзину

События product:added и product:delete генерируются при клике на кнопку "Купить" или "Удалить" на карточке товара.
Обработчики событий обновляют корзину в модели appData и закрывают модальное окно.

#### 4. Отображение корзины

Событие basket:open генерируется при клике на иконку корзины.
Обработчик события отображает содержимое корзины (Basket) в модальном окне.
Корзина обновляется при изменении данных (basket:change), отображая список товаров и общую стоимость.

#### 5. Оформление заказа

Событие order:open генерируется при переходе к оформлению заказа из корзины.
Обработчик события отображает форму заказа (OrderAddress) в модальном окне.
Форма позволяет выбрать способ оплаты и указать адрес доставки.

#### 6. Форма контактов

Событие contacts:open генерируется при переходе к форме контактов.
Обработчик события отображает форму контактов (Contacts) в модальном окне.
Форма позволяет указать email и телефон.

#### 7. Валидация форм

События formContactsErrors:change и formAddresErrors:change генерируются при изменении данных в формах.
Обработчики событий проверяют валидность данных и отображают ошибки, если необходимо.

#### 8. Отправка заказа

Событие contacts:submit генерируется при отправке формы контактов.
Обработчик события отправляет данные заказа на сервер с помощью api.orderProducts.
В случае успеха отображается сообщение об успешном заказе (Success).
Корзина очищается, и страница обновляется.

#### 9. Управление модальным окном

События modal:open и modal:close управляют состоянием модального окна, блокируя или разблокируя прокрутку страницы.

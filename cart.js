// Функция для получения данных из localStorage
function getFromLocalStorage() {
  try {
    const data = localStorage.getItem("shoppingList");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    return [];
  }
}

function openMenu() {
  const menuHtml = `
    <div class="modal-menu-content">
      <button class="close-btn" id="closeBtn">✖</button>
      <a href="./index.html" class="home-link-2 hl2 " id="home">Home</a>
      <a href="./cart.html" class="cart-link-2 cl2 " id="cart">Shopping cart</a>
      <button id="btnRegistrModal" class="registr">Sign Up</button>
      <button id="btnLogout" class="logout2 hidden">Log Out</button>
    </div>`;

  const instance = basicLightbox.create(menuHtml, {
    onShow: (instance) => {
      console.log("Menu opened");

      // Обработчик для кнопки "Close"
      const closeBtn = instance.element().querySelector("#closeBtn");
      closeBtn.addEventListener("click", () => {
        closeMenu(); // Закрыть меню при нажатии кнопки "Close"
      });

      const btnRegistrModal = instance
        .element()
        .querySelector("#btnRegistrModal");
      btnRegistrModal.addEventListener("click", () => {
        console.log("Sign Up button clicked");
        createWindowRegistr(); // Вызываем окно регистрации
      });

      const btnLogout = instance.element().querySelector("#btnLogout");
      btnLogout.addEventListener("click", handleLogout);
      const homeLinks = instance.element().querySelector(".hl2");
      const shoppingCartLinks = instance.element().querySelector(".cl2");
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          isUserLoggedIn = true;
          btnRegistrModal.style.display = "none";
          btnLogout.style.display = "block";
          homeLinks.style.display = "block";
          shoppingCartLinks.style.display = "block";
        } else {
          isUserLoggedIn = false;
          btnLogout.style.display = "none";
          btnRegistrModal.style.display = "block";
          homeLinks.style.display = "none";
          homeLinks.style.display = "none";
          shoppingCartLinks.style.display = "none";
        }
      });
    },
  });

  instance.show(); // Показываем модальное окно
  window.instance = instance; // Сохраняем экземпляр модального окна для закрытия
}

function closeMenu() {
  if (window.instance) {
    window.instance.close(); // Закрываем модальное окно
  }
}

// Функция для рендеринга списка покупок
function renderShoppingList() {
  const shoppingListContainer = document.getElementById("shopping-list");
  const emptyMessage = document.getElementById("empty-message");
  const clearListBtn = document.getElementById("clear-list-btn");
  shoppingListContainer.innerHTML = "";

  const shoppingList = getFromLocalStorage();

  if (shoppingList.length === 0) {
    emptyMessage.style.visibility = "visible";
    clearListBtn.style.display = "none";
  } else {
    clearListBtn.style.display = "flex";
    emptyMessage.style.visibility = "hidden";
    shoppingList.forEach((book, index) => {
      const bookItem = document.createElement("li");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
        <img src="${
          book.book_image ? book.book_image : "./img/book.jpg"
        }" alt="${book.title}" width="100" height="180"/>
        <div class="book-info">
          <div class="container-delBook-btn">
            <h2 class="title-in-cart">${book.title}</h2>
            <img src="./img/deleteBook.svg" alt="del" class="delete-book-btn">
          </div>
          <p><strong>${book.author}</strong></p>
          <p>${
            book.description
              ? book.description
              : "No information about this book. You can try to search for it on other sourses."
          }</p>
          
        </div>
      `;

      // Добавляем обработчик для кнопки "Delete Book"
      const deleteButton = bookItem.querySelector(".delete-book-btn");
      deleteButton.addEventListener("click", () => deleteBook(index));

      shoppingListContainer.appendChild(bookItem);
    });
  }
}

// Функция для удаления книги
function deleteBook(index) {
  const shoppingList = getFromLocalStorage();
  shoppingList.splice(index, 1); // Удаляем книгу по индексу
  saveToLocalStorage(shoppingList); // Сохраняем обновленный список в localStorage
  renderShoppingList(); // Перерендериваем список
  location.reload();
}

// Функции для работы с localStorage
function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("shoppingList") || "[]");
}

function saveToLocalStorage(shoppingList) {
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}



document.addEventListener("DOMContentLoaded", function () {
  const clearListBtn = document.getElementById("clear-list-btn");

  // Проверка на существование кнопки
  if (clearListBtn) {
    clearListBtn.addEventListener("click", clearShoppingList);
  } else {
    console.warn("Кнопка очистки списка не найдена на странице.");
  }
});

// Функция для очистки списка покупок
function clearShoppingList() {
  console.log("Кнопка очистки списка нажата"); // Сообщение для отладки

  // Проверка, существует ли элемент в localStorage
  if (localStorage.getItem("shoppingList") !== null) {
    localStorage.removeItem("shoppingList"); // Удаление списка из localStorage
    console.log("Список покупок успешно удален из localStorage");

    // Перерисовываем список на странице
    renderShoppingList();

    // Небольшая задержка перед перезагрузкой страницы
    setTimeout(() => {
      location.reload();
    }, 100); // Задержка в 100 мс для завершения очистки
  } else {
    console.warn("Список покупок уже пуст или не существует в localStorage");
  }
}

const body = document.body;
const toggleSwitch = document.getElementById("theme-toggle");

// Функция для применения темы
function applyTheme(theme) {
  body.classList.toggle("dark", theme === "dark");
  body.classList.toggle("light", theme === "light");

  // Обновляем положение переключателя
  toggleSwitch.checked = theme === "dark";
}

// Загружаем предпочтения темы при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light"; // По умолчанию светлая тема
  applyTheme(savedTheme);
});

// Обработчик переключения темы
toggleSwitch.addEventListener("change", function () {
  const newTheme = this.checked ? "dark" : "light";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});


document.getElementById("show-more-btn").addEventListener("click", function () {
  const hiddenItems = document.querySelector(".hidden-items");
  const visibleItems = document.querySelectorAll(
    ".uk-menu > div:not(.hidden-items):not(.cont-show-more-btn)"
  );
  const menuContainer = document.querySelector(".uk-menu"); // контейнер с меню

  // Проверяем текущее состояние
  if (
    hiddenItems.style.display === "" ||
    hiddenItems.style.display === "none"
  ) {
    // Скрываем первые 6 элементов
    visibleItems.forEach((item) => {
      item.style.display = "none";
    });

    // Показываем скрытые элементы
    hiddenItems.style.display = "block";

    // Прокручиваем вниз к скрытым элементам внутри контейнера
    menuContainer.scrollTop = menuContainer.scrollHeight; // прокрутка до конца

    // Меняем иконку на стрелку вверх
    this.querySelector("img").src = "./img/uk-menu-up-arrow.svg";
  } else {
    // Показываем первые 6 элементов
    visibleItems.forEach((item) => {
      item.style.display = "block";
    });

    // Скрываем дополнительные элементы
    hiddenItems.style.display = "none";

    // Прокручиваем обратно к началу контейнера
    menuContainer.scrollTop = 0; // прокрутка вверх

    // Меняем иконку на стрелку вниз
    this.querySelector("img").src = "./img/uk-menu-down-arrow.svg";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  renderShoppingList(); // Рендеринг списка книг
  toggleTheme(); // Тема
  const shoppingList = getFromLocalStorage();
  if (shoppingList.length > 3) {
    // Инициализация пагинации
    initializePagination();
  }
  const clearListBtn = document.getElementById("clear-list-btn");
  clearListBtn.addEventListener("click", clearShoppingList);
});

// Функция для инициализации пагинации
function initializePagination() {
  var paginator = document.querySelector(".paginator");

  // Функция для обновления пагинации
  function updatePagination() {
    var div_num = document.querySelectorAll(".book-item"); // Получаем все книги
    var count = div_num.length; // Общее количество записей
    var cnt = 3; // Количество отображаемых книг на странице
    var cnt_page = Math.ceil(count / cnt); // Количество страниц

    // Скрываем пагинацию, если книг 3 или меньше
    if (count <= cnt) {
      paginator.style.display = "none"; // Скрываем пагинацию
      // Также скрываем все книги, если их меньше 3
      div_num.forEach((item) => {
        item.style.display = "flex"; // Показываем все книги
      });
      return; // Выходим из функции
    } else {
      paginator.style.display = "flex"; // Показываем пагинацию
    }

    // Очищаем старые страницы
    paginator.innerHTML = "";

    // Создаем кнопки пагинации
    for (var i = 0; i < cnt_page; i++) {
      var span = document.createElement("span");
      span.dataset.page = i * cnt; // Устанавливаем номер страницы
      span.id = "page" + (i + 1); // Уникальный ID для каждой страницы
      span.textContent = i + 1; // Номер страницы
      paginator.appendChild(span);
    }

    // Показываем первые записи
    for (var i = 0; i < div_num.length; i++) {
      div_num[i].style.display = i < cnt ? "flex" : "none"; // Показываем только первые книги
    }

    // Активируем первую страницу по умолчанию
    var main_page = document.getElementById("page1");
    if (main_page) {
      main_page.classList.add("paginator_active");
    }
  }

  // Листаем страницы
  paginator.addEventListener("click", function (event) {
    var target = event.target;

    if (target.tagName.toLowerCase() !== "span") return; // Проверяем, что кликнули на span

    var data_page = +target.dataset.page; // Получаем номер страницы

    // Обновляем активную страницу
    document.querySelector(".paginator_active")?.classList.remove("paginator_active");
    target.classList.add("paginator_active");

    // Скрываем все элементы
    var div_num = document.querySelectorAll(".book-item");
    for (var i = 0; i < div_num.length; i++) {
      div_num[i].style.display = "none";
    }

    // Показываем нужные элементы в зависимости от страницы
    for (var i = data_page; i < data_page + 3; i++) {
      if (i < div_num.length) {
        div_num[i].style.display = "flex"; // Показываем только те элементы, которые относятся к текущей странице
      }
    }
  });

  // Первоначальная инициализация пагинации
  updatePagination();

  // Отслеживание изменений в списке книг
  const observer = new MutationObserver(updatePagination);
  const bookListContainer = document.querySelector(".book-list-container"); // Контейнер, содержащий книги

  if (bookListContainer) {
    observer.observe(bookListContainer, { childList: true, subtree: true });
  }
}

// Запускаем функцию при загрузке документа
document.addEventListener("DOMContentLoaded", initializePagination);



// Регистрация функции для открытия окна регистрации
const signInButton = document.getElementById("btnRegistr");
signInButton.addEventListener("click", createWindowRegistr);

function createWindowRegistr() {
  instance = basicLightbox.create(
    `
    <div class="auth-container">
      <form action="" class="form-reg" id="registration-form">
        <div class="container-cross">
          <button type="button" onclick="instance.close()">
            <img src="./img/cross.svg" alt="Close" width="20">
          </button>
        </div>
        <input type="text" id="name" placeholder="NAME" required />
        <input type="email" id="email" placeholder="EMAIL" required />
        <input type="password" id="password" placeholder="PASSWORD" required />
        <button type="submit">SIGN UP</button>
        <p class="registration-message" id="registration-message"></p>
        <p>
        Already have an account? <a href="#" id="switch-to-signin">Sign In</a>
        </p>
      </form>
    </div>
    `,
    {
      onShow: (instance) => {
        instance.element().style.backgroundColor = "rgb(79, 46, 232)";
      },
      closable: false, // Отключаем закрытие модалки при клике за её пределами
    }
  );

  // Отображаем окно
  instance.show();

  // Получаем форму и добавляем обработчик события submit
  const form = document.getElementById("registration-form");
  form.addEventListener("submit", handleRegistration);

  // Обработчик для переключения на форму входа
  document
    .getElementById("switch-to-signin")
    .addEventListener("click", function (e) {
      e.preventDefault();
      instance.close(); // Закрываем модалку
      createSignInWindow(); // Открываем окно входа
    });
}

// Функция для создания окна входа
function createSignInWindow() {
  instance = basicLightbox.create(
    `
    <div class="auth-container">
      <form action="" class="form-reg" id="signin-form">
        <div class="container-cross">
          <button type="button" onclick="instance.close()">
            <img src="./img/cross.svg" alt="Close" width="20">
          </button>
        </div>
        <input type="email" id="signin-email" placeholder="EMAIL" required />
        <input type="password" id="signin-password" placeholder="PASSWORD" required />
        <button type="submit">SIGN IN</button>
        <p class="signin-message" id="signin-message"></p>
        <p>
        Don't have an account? <a href="#" id="switch-to-signup">Sign Up</a>
      </p>
      </form>
    </div>
    `,
    {
      onShow: (instance) => {
        instance.element().style.backgroundColor = "rgb(79, 46, 232)";
      },
      closable: false, // Отключаем закрытие модалки при клике за её пределами
    }
  );

  // Отображаем окно
  instance.show();

  // Получаем форму и добавляем обработчик события submit
  const signinForm = document.getElementById("signin-form");
  signinForm.addEventListener("submit", handleSignIn);

  // Обработчик для переключения на форму регистрации
  document
    .getElementById("switch-to-signup")
    .addEventListener("click", function (e) {
      e.preventDefault();
      instance.close(); // Закрываем модалку
      createWindowRegistr(); // Открываем окно регистрации
    });
}

// Обработчик отправки формы с Firebase для регистрации
function handleRegistration(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageEl = document.getElementById("registration-message");

  if (!name || !email || !password) {
    messageEl.textContent = "Please fill in all fields.";
    messageEl.style.color = "red";
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          messageEl.textContent = "Registration successful!";
          messageEl.style.color = "green";
          updateUIOnLogin(user); // Обновляем UI после регистрации
          instance.close(); // Закрываем модалку
        })
        .catch((error) => {
          messageEl.textContent = "Error updating profile: " + error.message;
          messageEl.style.color = "red";
        });
    })
    .catch((error) => {
      messageEl.textContent = "Error: " + error.message;
      messageEl.style.color = "red";
    });
  location.reload();
}

// Обработчик отправки формы с Firebase для входа
function handleSignIn(event) {
  event.preventDefault();

  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value.trim();
  const messageEl = document.getElementById("signin-message");

  if (!email || !password) {
    messageEl.textContent = "Please fill in all fields.";
    messageEl.style.color = "red";
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateUIOnLogin(user); // Обновляем UI после входа
      instance.close(); // Закрываем модалку
      location.reload();
      location.reload();
    })
    .catch((error) => {
      messageEl.textContent = "Incorrect password or email";
      messageEl.style.color = "red";
    });
}

// Обновление UI после входа/регистрации
function updateUIOnLogin(user) {
  const signInButton = document.getElementById("btnRegistr");
  signInButton.textContent = `${user.displayName}`;
  signInButton.classList.add("logged-in");

  // Показать кнопку "Log Out"
  const logoutButton = document.getElementById("btnLogout");
  logoutButton.classList.remove("hidden");
  logoutButton.style.display = "block"; // Показываем кнопку

  // Добавляем обработчик события для кнопки "Log Out"
  logoutButton.addEventListener("click", handleLogout);
}

// Обработчик события выхода
function handleLogout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      const signInButton = document.getElementById("btnRegistr");

      // Устанавливаем текст и изображение для кнопки "Sign In"
      signInButton.innerHTML = `Sign In <img src="./img/arrow_right_icon_125381.svg" alt="" class="arrow-right">`;
      signInButton.classList.remove("logged-in");

      const logoutButton = document.getElementById("btnLogout");
      logoutButton.style.display = "none"; // Скрываем кнопку
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
}

// Пример вызова функции обновления UI при входе
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    updateUIOnLogin(user);
  } else {
    const logoutButton = document.getElementById("btnLogout");
    const homeLink = document.getElementById("home");
    const shoppingCartLink = document.getElementById("cart");
    logoutButton.style.display = "none"; // Скрываем кнопку
    homeLink.style.display = "none"; //скрываем ссылку на главную страницу если пользователь не зарегистрирован
    shoppingCartLink.style.display = "none"; //скрываем ссылку на корзину если пользователь не зарегистрирован
  }
});

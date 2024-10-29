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
      <button class="close-btn" onclick="closeMenu()">✖</button>
      <a href="./index.html" class="home-link-2">Home</a>
      <a href="./cart.html" class="cart-link-2">Shopping cart</a>
      <button id="btnRegistrModal" class="registr">Sing Up<img src="./img/arrow_right_icon_125381.svg" alt="" class="arrow-right" /></button>
      <button id="btnLogout" class="logout">Выйти</button>
    </div>`;

  window.instance = basicLightbox.create(menuHtml, {
    onShow: (instance) => {
      const btnRegistrModal = instance
        .element()
        .querySelector("#btnRegistrModal");
      btnRegistrModal.addEventListener("click", () => {
        createWindowRegistr();
      });
    },
  });
  instance.show();
}

function closeMenu() {
  if (window.instance) instance.close();
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
    // Показываем сообщение, если список пуст
  } else {
    clearListBtn.style.display = "flex";
    emptyMessage.style.visibility = "hidden"; // Скрываем сообщение
    shoppingList.forEach((book) => {
      shoppingListContainer.innerHTML += `
        <li class="book-item">
          <img src="${
            book.book_image ? book.book_image : "./img/book.jpg"
          }" alt="${book.title}" />
          <div class="book-info">
            <h2>${book.title}</h2>
            <p><strong>${book.author}</strong></p>
            <p>${book.description}</p>
          </div>
        </li>
      `;
    });
  }
}

// Функция для очистки списка покупок
function clearShoppingList() {
  localStorage.removeItem("shoppingList");
  renderShoppingList(); // Перерисовываем список после очистки
  location.reload();
}

// Переключение темы
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  if (isDarkMode) {
    body.classList.add("dark");
    themeToggle.checked = true;
  } else {
    body.classList.remove("dark");
    themeToggle.checked = false;
  }

  themeToggle.addEventListener("change", function () {
    if (themeToggle.checked) {
      body.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

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
  var count = document.querySelectorAll(".book-item").length; // всего записей (количество .book-item)
  var cnt = 3; // сколько отображаем сначала
  var cnt_page = Math.ceil(count / cnt); // кол-во страниц

  // Выводим список страниц
  var paginator = document.querySelector(".paginator");
  var page = "";

  for (var i = 0; i < cnt_page; i++) {
    page +=
      "<span data-page=" +
      i * cnt +
      ' id="page' +
      (i + 1) +
      '">' +
      (i + 1) +
      "</span>";
  }
  paginator.innerHTML = page;

  // Показываем первые записи {cnt}
  var div_num = document.querySelectorAll(".book-item");

  for (var i = 0; i < div_num.length; i++) {
    if (i < cnt) {
      div_num[i].style.display = "flex";
    } else {
      div_num[i].style.display = "none"; // Скрываем остальные элементы
    }
  }

  // Активируем первую страницу по умолчанию
  var main_page = document.getElementById("page1");
  main_page.classList.add("paginator_active");

  // Листаем страницы
  paginator.addEventListener("click", pagination);

  function pagination(event) {
    var e = event || window.event;
    var target = e.target;

    // Проверяем, что кликнули на span
    if (target.tagName.toLowerCase() !== "span") return;

    var data_page = +target.dataset.page; // Получаем номер страницы
    var num_ = target.id.substr(4); // Определяем номер страницы по id

    // Обновляем активную страницу
    main_page.classList.remove("paginator_active");
    main_page = document.getElementById("page" + num_);
    main_page.classList.add("paginator_active");

    // Скрываем все элементы
    for (var i = 0; i < div_num.length; i++) {
      div_num[i].style.display = "none";
    }

    // Показываем нужные элементы в зависимости от страницы
    for (var i = data_page; i < data_page + cnt; i++) {
      if (i < div_num.length) {
        div_num[i].style.display = "flex"; // Показываем только те элементы, которые относятся к текущей странице
      }
    }
  }
}

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

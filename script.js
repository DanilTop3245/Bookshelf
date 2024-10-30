// Theme Toggle Elements
const toggleSwitch = document.getElementById("theme-toggle");
const header = document.getElementById("main-header");
const chapters = document.querySelectorAll(".chapt");
const bookLoader = document.querySelector(".loader__backdrop");
const bookListContainer = document.querySelector(".js-book-list");
const modal = document.getElementById("modals-book");
let isUserLoggedIn = false;

// Function to Show Loader
function showLoader() {
  bookLoader.style.display = "block";
}

// Function to Hide Loader
function hideLoader() {
  setTimeout(() => {
    bookLoader.style.display = "none";
  }, 300);
}

// Initial Loader Display

function openMenu() {
  const menuHtml = `
    <div class="modal-menu-content">
      <button class="close-btn" id="closeBtn">✖</button>
      <a href="./index.html" class="home-link hl2 " id="home">Home</a>
      <a href="./cart.html" class="cart-link cl2 " id="cart">Shopping cart</a>
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

// firebase.auth().onAuthStateChanged((user) => {
//   const signInButton = document.getElementById("btnRegistrModal");
//   const logoutButton = document.getElementById("btnLogout");

//   if (user) {
//     isUserLoggedIn = true;

//     // Отображаем логин и скрываем кнопку "Sign Up"
//     signInButton.style.display = "none"; // Скрываем кнопку "Sign Up"

//     // Показываем кнопку "Log Out" и добавляем обработчик события
//     logoutButton.style.display = "block";
//     logoutButton.addEventListener("click", handleLogout);
//   } else {
//     isUserLoggedIn = false;

//     // Возвращаем текст и показываем кнопку "Sign Up"
//     signInButton.innerHTML =
//       'Sign Up <img src="./img/arrow_right_icon_125381.svg" alt="" class="arrow-right">';
//     signInButton.style.display = "block"; // Показываем кнопку "Sign Up"

//     // Скрываем кнопку "Log Out"
//     logoutButton.style.display = "none";
//     logoutButton.removeEventListener("click", handleLogout); // Удаляем обработчик, если пользователь вышел
//   }
// });

// function handleLogout() {
//   firebase
//     .auth()
//     .signOut()
//     .then(() => {
//       const signInButton = document.getElementById("btnRegistrModal");
//       const logoutButton = document.getElementById("btnLogout");

//       // Восстанавливаем кнопку "Sign Up" и скрываем "Log Out"
//       signInButton.innerHTML =
//         'Sign Up <img src="./img/arrow_right_icon_125381.svg" alt="" class="arrow-right">';
//       signInButton.style.display = "block"; // Показываем кнопку "Sign Up"
//       logoutButton.style.display = "none";
//     });
// }

// function updateUIOnLogin(user) {
//   const signInButton = document.getElementById("btnRegistr");
//   signInButton.textContent = `${user.displayName}`;
//   signInButton.classList.add("logged-in");

//   // Показать кнопку "Log Out"
//   const logoutButton = document.getElementById("btnLogout");
//   logoutButton.classList.remove("hidden");
//   logoutButton.style.display = "block"; // Показываем кнопку

//   // Добавляем обработчик события для кнопки "Log Out"
//   logoutButton.addEventListener("click", handleLogout);
// }

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     updateUIOnLogin(user);
//   } else {
//     const logoutButton = document.getElementById("btnLogout");
//     const homeLink = document.getElementById("home");
//     const shoppingCartLink = document.getElementById("cart");
//     const addToCartBtn = document.getElementById("add");
//     logoutButton.style.display = "none"; // Скрываем кнопку
//     homeLink.style.display = "none"; //скрываем ссылку на главную страницу если пользователь не зарегистрирован
//     shoppingCartLink.style.display = "none"; //скрываем ссылку на корзину если пользователь не зарегистрирован
//     addToCartBtn.classList.add("hidden"); //скрываем кнопку добавить в корзину если пользователь не зарегистрирован
//   }
// });

// Theme Toggle Functionality

// Function to Save Theme Preference in Local Storage
function saveThemePreference(theme) {
  localStorage.setItem("theme", theme);
}

// Функция для применения темы
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  document.body.classList.toggle("light", theme === "light");
  header.classList.toggle("dark", theme === "dark");
  header.classList.toggle("light", theme === "light");

  chapters.forEach(function (chapt) {
    chapt.classList.toggle("dark", theme === "dark");
    chapt.classList.toggle("light", theme === "light");
  });

  document.querySelectorAll(".see-more").forEach((button) => {
    button.classList.toggle("dark", theme === "dark");
    button.classList.toggle("light", theme === "light");
  });

  if (modal) {
    modal.classList.toggle("dark", theme === "dark");
    modal.classList.toggle("light", theme === "light");
  }

  // Обновляем положение переключателя
  toggleSwitch.checked = theme === "dark";
}

// Загружаем предпочтения темы при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light"; // По умолчанию светлая тема
  applyTheme(savedTheme);
});

// Переключаем тему и сохраняем предпочтение
toggleSwitch.addEventListener("change", function () {
  const newTheme = this.checked ? "dark" : "light";
  applyTheme(newTheme);
  saveThemePreference(newTheme);
});
showLoader();

// Function to Fetch Categories
function fetchCategories() {
  return fetch(`https://books-backend.p.goit.global/books/category-list`).then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}

// Function to Fetch Books by Category
function fetchBooksByCategory(category) {
  return fetch(`
    https://books-backend.p.goit.global/books/category?category=${encodeURIComponent(
      category
    )}`).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

// Function to Create Book Card Markup
// Function to Create Book Card Markup with Apple Books link
function createBookCard({ book_image, title, author, _id, apple_books_link }) {
  return `
    <div class="book-card js-product-item" data-id="${_id}">
      <img src="${
        book_image ? book_image : "./img/book.jpg"
      }" alt="${title}" width="190" />
      <h4>${title}</h4>
      <span><i>${author}</i></span>
    </div>`;
}

// Modify the handlerClick function to pull Apple Books link
// Модальное окно и работа с корзиной
bookListContainer.addEventListener("click", handlerClick);

function handlerClick(evt) {
  const currentProduct = evt.target.closest(".js-product-item");

  if (!currentProduct) return;

  const bookId = currentProduct.dataset.id;

  fetch(`https://books-backend.p.goit.global/books/${bookId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch book details");
      return response.json();
    })
    .then((book) => {
      const appleLinkObj = book.buy_links.find(
        (link) => link.name === "Apple Books"
      );
      const appleLink = appleLinkObj ? appleLinkObj.url : null;

      const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      const amazonIcon =
        currentTheme === "dark"
          ? "./img/amazon_white.png"
          : "./img/amazon_black.png";
      const crossIcon =
        currentTheme === "dark" ? "./img/cross_white.svg" : "./img/cross.svg";

      const instance = basicLightbox.create(
        `
        <div class="modal-main ${currentTheme}">
          <div class="cont-cross">
            <img src="${crossIcon}" alt="Close" class="close-btn-2" id="closeBtn">
          </div>
          <div class="modal ${currentTheme}" id="modals-book">
            <div class="cont-modal ${currentTheme}">
              <div class="img-in-modal">
                <img src="${book.book_image}" alt="${book.title}">
              </div>
              <div class="desc-block">
                <div class="desc-in-modal">
                  <h2>${book.title}</h2>
                  <span><i>${book.author}</i></span>
                  <p>${
                    book.description
                      ? book.description
                      : "No information about this book"
                  }</p>
                </div>
                <div class="book-site-container">
                  <a href="${book.amazon_product_url}" target="_blank">
                    <img src="${amazonIcon}" alt="Amazon" class="amazon-icon">
                  </a>
                  ${
                    appleLink
                      ? `<a href="${appleLink}" target="_blank"><img src="./img/apple_book.svg" alt="Apple Books" class="apple-book"></a>`
                      : "<span>Apple Books не доступен</span>"
                  }
                </div>
                ${
                  isUserLoggedIn
                    ? `<button type="button" class="modal-book-btn hidden btn-add" id="add">Add to shopping list</button>`
                    : ""
                }
                <button type="button" class="modal-book-btn hidden" id="remove">
                  Remove from the shopping list
                </button>
                <p class="txt-remove hidden">
                  Congratulations! You have added the book to the shopping list. To delete, press the button “Remove from the shopping list”.
                </p>
              </div>
            </div>
          </div>
        </div>`
      );

      instance.show();

      const closeBtn = document.querySelector("#closeBtn");
      closeBtn.addEventListener("click", () => {
        instance.close();
      });

      // Логирование текущей темы и иконки для отладки
      console.log("Current theme:", currentTheme);
      console.log("Cross icon path:", crossIcon);

      if (isUserLoggedIn) {
        const btnAddEl = document.querySelector("#add");
        const btnRemoveEl = document.querySelector("#remove");
        const textRemoveEl = document.querySelector(".txt-remove");

        if (checkBookInLocalStorage(bookId)) {
          btnRemoveEl.classList.remove("hidden");
          textRemoveEl.classList.remove("hidden");
        } else {
          btnAddEl.classList.remove("hidden");
        }

        btnAddEl.addEventListener("click", () => {
          setToLocalStorage(book);
          btnAddEl.classList.add("hidden");
          btnRemoveEl.classList.remove("hidden");
          textRemoveEl.classList.remove("hidden");
        });

        btnRemoveEl.addEventListener("click", () => {
          removeFromCart(bookId);
          btnAddEl.classList.remove("hidden");
          btnRemoveEl.classList.add("hidden");
          textRemoveEl.classList.add("hidden");
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
    });
}


// Функции для работы с localStorage
function setToLocalStorage(book) {
  const localArr = getFromLocalStorage();
  localArr.push(book);
  addToLocalStorage(localArr);
}

function removeFromCart(id) {
  const currentData = getFromLocalStorage();
  const updatedData = currentData.filter((item) => item._id !== id);
  addToLocalStorage(updatedData);
}

function addToLocalStorage(arr) {
  localStorage.setItem("shoppingList", JSON.stringify(arr));
}

function getFromLocalStorage() {
  try {
    const data = localStorage.getItem("shoppingList");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error.message);
  }
}

function checkBookInLocalStorage(id) {
  const currentList = getFromLocalStorage();
  return currentList.some((book) => book._id === id);
}

// Function to Clear Current Books
function clearBooks() {
  bookListContainer.innerHTML = "";
}

// Function to Render Books for a Single Category
function renderBooks(category, books) {
  clearBooks();
  bookListContainer.classList.add("loading");

  // Create Category Section Element
  const categorySection = document.createElement("div");
  categorySection.classList.add("category-section");

  // Create Category Title
  const categoryTitle = document.createElement("h4");
  categoryTitle.classList.add("category-title");
  categoryTitle.textContent = category;
  categorySection.appendChild(categoryTitle);

  // Create Books Container
  const booksContainer = document.createElement("div");
  booksContainer.classList.add("books-container");

  // Render All Books
  books.forEach((book) => {
    booksContainer.innerHTML += createBookCard(book);
  });

  categorySection.appendChild(booksContainer);

  // Append the Category Section to the Book List Container
  bookListContainer.appendChild(categorySection);

  // Remove loading class after a short delay to allow animation
  setTimeout(() => {
    bookListContainer.classList.remove("loading");
    hideLoader();
  }, 300);
}

// Function to Render All Categories with Books
function renderAllCategories(categories) {
  clearBooks();
  bookListContainer.classList.add("loading");

  // Sort categories alphabetically
  categories.sort((a, b) => a.list_name.localeCompare(b.list_name));

  let fetchPromises = categories.map((category) => {
    return fetchBooksByCategory(category.list_name)
      .then((books) => {
        // Create Category Section Element
        const categorySection = document.createElement("div");
        categorySection.classList.add("category-section");

        // Create Category Title
        const categoryTitle = document.createElement("h4");
        categoryTitle.classList.add("category-title");
        categoryTitle.textContent = category.list_name;
        categorySection.appendChild(categoryTitle);

        // Create Books Container
        const booksContainer = document.createElement("div");
        booksContainer.classList.add("books-container");

        // Determine the number of books to show initially
        const initialBooks = books.slice(0, 4);
        const remainingBooks = books.slice(4);

        // Render Initial Books
        initialBooks.forEach((book) => {
          booksContainer.innerHTML += createBookCard(book);
        });

        categorySection.appendChild(booksContainer);

        // If there are more than four books, add a 'See More' button
        if (remainingBooks.length > 0) {
          const seeMoreButton = document.createElement("button");
          seeMoreButton.classList.add("see-more", "light"); // Default to light theme
          seeMoreButton.textContent = "See More";
          seeMoreButton.dataset.category = category.list_name; // Assign category to button for reference

          // Add Event Listener to 'See More' Button
          seeMoreButton.addEventListener("click", function () {
            // Toggle between showing initial books and all books
            if (seeMoreButton.textContent === "See More") {
              // Render Remaining Books
              remainingBooks.forEach((book) => {
                booksContainer.innerHTML += createBookCard(book);
              });
              seeMoreButton.textContent = "See Less";
            } else {
              // Remove Remaining Books
              booksContainer.innerHTML = "";
              initialBooks.forEach((book) => {
                booksContainer.innerHTML += createBookCard(book);
              });
              seeMoreButton.textContent = "See More";
            }
          });

          categorySection.appendChild(seeMoreButton);
        }

        // Append the Category Section to the Book List Container
        bookListContainer.appendChild(categorySection);
      })
      .catch((error) => {
        console.error(
          Error`fetching books for category "${category.list_name}"`,
          error
        );
      });
  });

  Promise.all(fetchPromises)
    .then(() => {
      bookListContainer.classList.remove("loading");
      hideLoader();
    })
    .catch((error) => {
      console.error("Error rendering all categories:", error);
      hideLoader();
    });
}

// Function to Render All Books from All Categories
function renderAllBooks() {
  fetchCategories()
    .then((categories) => {
      renderAllCategories(categories);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      bookListContainer.innerHTML = `<p>Error loading categories. Please try again later.</p>`;
      hideLoader();
    });
}

// Function to Handle Category Clicks
function handleCategoryClicks() {
  const categoryLinks = document.querySelectorAll(".chapt");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      const selectedCategory = this.textContent.trim();

      // Show Loader
      showLoader();

      if (selectedCategory === "All categories") {
        renderAllBooks();
      } else {
        fetchBooksByCategory(selectedCategory)
          .then((books) => {
            renderBooks(selectedCategory, books);
          })
          .catch((error) => {
            console.error(
              Error`fetching books for category "${selectedCategory}"`,
              error
            );
            bookListContainer.innerHTML = `<p>Error loading books for "${selectedCategory}". Please try again later.</p>`;
            hideLoader();
          });
      }

      // Optional: Highlight the selected category
      categoryLinks.forEach((lnk) => lnk.classList.remove("active"));
      this.classList.add("active");
    });
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

// Регистрация функции для открытия окна регистрации
const signInButton = document.getElementById("btnRegistr");
signInButton.addEventListener("click", createWindowRegistr);

function createWindowRegistr() {
  // Создаем окно модалки
  const registrationHtml = `
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
    </div>`;

  instance = basicLightbox.create(registrationHtml, {
    onShow: (instance) => {
      instance.element().style.backgroundColor = "rgb(79, 46, 232)";

      // Получаем форму и добавляем обработчик события submit
      const form = instance.element().querySelector("#registration-form");
      if (form) {
        form.addEventListener("submit", handleRegistration);
      } else {
        console.error("Registration form not found");
      }

      // Обработчик для переключения на форму входа
      const switchToSignIn = instance
        .element()
        .querySelector("#switch-to-signin");
      if (switchToSignIn) {
        switchToSignIn.addEventListener("click", function (e) {
          e.preventDefault();
          instance.close(); // Закрываем модалку
          createSignInWindow(); // Открываем окно входа
        });
      } else {
        console.error("Switch to Sign In link not found");
      }
    },
    closable: false,
  });

  // Отображаем окно
  instance.show();
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
    </div>`,
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
          location.reload();
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
    const addToCartBtn = document.getElementById("add");
    logoutButton.style.display = "none"; // Скрываем кнопку
    homeLink.style.display = "none"; //скрываем ссылку на главную страницу если пользователь не зарегистрирован
    shoppingCartLink.style.display = "none"; //скрываем ссылку на корзину если пользователь не зарегистрирован
    addToCartBtn.classList.add("hidden"); //скрываем кнопку добавить в корзину если пользователь не зарегистрирован
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    isUserLoggedIn = true;
    updateUIOnLogin(user);
  } else {
    isUserLoggedIn = false;
    const logoutButton = document.getElementById("btnLogout");
    logoutButton.style.display = "none";
  }
});

// Initial Function to Load and Render All Categories and Their Books
function init() {
  renderAllBooks();
  handleCategoryClicks();
}

// Execute Initialization
init();

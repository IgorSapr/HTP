// modal

class Modal {
  constructor(options) {
    let defaultOptions = {
      isOpen: () => {},
      isClose: () => {},
    };
    this.options = Object.assign(defaultOptions, options);
    this.modal = document.querySelector(".modal");
    this.speed = false;
    this.animation = false;
    this.isOpen = false;
    this.modalContainer = false;
    this.previousActiveElement = false;
    this.fixBlocks = document.querySelectorAll(".fix-block");
    this.focusElements = [
      "a[href]",
      "input",
      "button",
      "select",
      "textarea",
      "[tabindex]",
    ];
    this.events();
  }

  events() {
    if (this.modal) {
      document.addEventListener(
        "click",
        function (e) {
          const clickedElement = e.target.closest("[data-path]");
          if (clickedElement) {
            let target = clickedElement.dataset.path;
            let animation = clickedElement.dataset.animation;
            let speed = clickedElement.dataset.speed;
            this.animation = animation ? animation : "fade";
            this.speed = speed ? parseInt(speed) : 300;
            this.modalContainer = document.querySelector(
              `[data-target="${target}"]`
            );
            this.open();
            return;
          }

          if (e.target.closest(".modal-close")) {
            this.close();
            return;
          }
        }.bind(this)
      );

      window.addEventListener(
        "keydown",
        function (e) {
          if (e.keyCode == 27) {
            if (this.isOpen) {
              this.close();
            }
          }

          if (e.keyCode == 9 && this.isOpen) {
            this.focusCatch(e);
            return;
          }
        }.bind(this)
      );

      this.modal.addEventListener(
        "click",
        function (e) {
          if (
            !e.target.classList.contains("modal__container") &&
            !e.target.closest(".modal__container") &&
            this.isOpen
          ) {
            this.close();
          }
        }.bind(this)
      );
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;

    this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
    this.modal.classList.add("is-open");
    this.disableScroll();

    this.modalContainer.classList.add("modal-open");
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add("animate-open");
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove("animate-open");
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove("is-open");
      this.modalContainer.classList.remove("modal-open");

      this.enableScroll();
      this.options.isClose(this);
      this.isOpen = false;
      this.focusTrap();
    }
  }

  focusCatch(e) {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }

    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    if (this.isOpen) {
      focusable[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    let pagePosition = window.scrollY;
    this.lockPadding();
    document.body.classList.add("disable-scroll");
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + "px";
  }

  enableScroll() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    this.unlockPadding();
    document.body.style.top = "auto";
    document.body.classList.remove("disable-scroll");
    window.scroll({ top: pagePosition, left: 0 });
    document.body.removeAttribute("data-position");
  }

  lockPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + "px";
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    document.body.style.paddingRight = paddingOffset;
  }

  unlockPadding() {
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = "0px";
    });
    document.body.style.paddingRight = "0px";
  }
}

const modal = new Modal({
  isOpen: (modal) => {
    console.log(modal);
    console.log("opened");
  },
  isClose: () => {
    console.log("closed");
  },
});

// form

console.log("Init!");

// inputmask
const form = document.querySelector(".form");
const telSelector = form.querySelector('input[type="tel"]');
const inputMask = new Inputmask("+7 (999) 999-99-99");
inputMask.mask(telSelector);

new window.JustValidate(".form", {
  rules: {
    tel: {
      required: true,
      function: () => {
        const phone = telSelector.inputmask.unmaskedvalue();
        return Number(phone) && phone.length === 10;
      },
    },
  },
  colorWrong: "#ff0f0f",
  messages: {
    name: {
      required: "Введите имя",
      minLength: "Введите 3 и более символов",
      maxLength: "Запрещено вводить более 15 символов",
    },
    email: {
      email: "Введите корректный email",
      required: "Введите email",
    },
    tel: {
      required: "Введите телефон",
      function: "Здесь должно быть 10 символов без +7",
    },
  },
  submitHandler: function (thisForm) {
    let formData = new FormData(thisForm);

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Отправлено");
        }
      }
    };

    xhr.open("POST", "php/mail.php", true);
    xhr.send(formData);

    thisForm.reset();
    modal.close();
  },
});

// Карточки

$(document).ready(async function () {
  console.log("fngjh");
  // 1 секция
  // данные апи
  var booksDataReq = await fetch(
    "http://89.111.133.194:8000/api/bottles/"
  ).then((response) => response.json());
  var booksData = booksDataReq["results"];
  var nextUrl = booksDataReq["next"];

  console.log(1, booksData);

  // первая загрузка бутылок
  booksData.slice(0, 4).forEach((element) => {
    var itemCard = renderItem(element, true);
    $("#bottles__container").append(itemCard);
    const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
    button.addEventListener("click", addToCartClicked);
  });

  if (nextUrl === null) {
    console.log("Длинна массива books меньше пагинации");
    $(".load-more-button").hide();
    return;
  }

  // загрузить больше
  $(".load-more-button").click(async function () {
    console.log(1, "ссылка " + nextUrl);

    var booksDataReq = await fetch(nextUrl).then((response) => response.json());
    var booksData = booksDataReq["results"];
    nextUrl = booksDataReq["next"];

    console.log(1, booksData);
    // пагинация
    // let pagination = 4;

    // первая загрузка бутылок
    booksData.slice(0, 4).forEach((element) => {
      var itemCard = renderItem(element, true);
      $("#bottles__container").append(itemCard);
      const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
      button.addEventListener("click", addToCartClicked);
    });

    if (nextUrl === null) {
      console.log("Длинна массива books меньше пагинации");
      $(".load-more-button").hide();
      return;
    }
  });
});

// 2 секция
$(document).ready(async function () {
  var booksDataReq = await fetch("http://89.111.133.194:8000/api/caps/").then(
    (response) => response.json()
  );
  var booksData = booksDataReq["results"];
  var nextUrl = booksDataReq["next"];

  console.log(1, booksData);

  // первая загрузка бутылок
  booksData.slice(0, 4).forEach((element) => {
    var itemCard = renderItem(element, false);
    $("#lids__container").append(itemCard);
    const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
    button.addEventListener("click", addToCartClicked);
  });

  if (nextUrl === null) {
    console.log("Длинна массива books меньше пагинации");
    $(".load-more-button-two").hide();
    return;
  }

  // загрузить больше
  $(".load-more-button-two").click(async function () {
    console.log(1, "ссылка " + nextUrl);

    var booksDataReq = await fetch(nextUrl).then((response) => response.json());
    var booksData = booksDataReq["results"];
    nextUrl = booksDataReq["next"];

    console.log(1, booksData);
    // пагинация
    // let pagination = 4;

    // первая загрузка бутылок
    booksData.slice(0, 4).forEach((element) => {
      var itemCard = renderItem(element, false);
      $("#lids__container").append(itemCard);
      const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
      button.addEventListener("click", addToCartClicked);
    });

    if (nextUrl === null) {
      console.log("Длинна массива books меньше пагинации");
      $(".load-more-button-two").hide();
      return;
    }
  });
});

// 3 секция
$(document).ready(async function () {
  var booksDataReq = await fetch(
    "http://89.111.133.194:8000/api/preforms/"
  ).then((response) => response.json());
  var booksData = booksDataReq["results"];
  var nextUrl = booksDataReq["next"];

  console.log(1, booksData);

  // первая загрузка бутылок

  booksData.slice(0, 4).forEach((element) => {
    var itemCard = renderItem(element, true);
    $("#preforms__container").append(itemCard);
    const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
    button.addEventListener("click", addToCartClicked);
  });

  if (nextUrl === null) {
    console.log("Длинна массива books меньше пагинации");
    $(".load-more-button-three").hide();
    return;
  }

  // загрузить больше
  $(".load-more-button-three").click(async function () {
    console.log(1, "ссылка " + nextUrl);

    var booksDataReq = await fetch(nextUrl).then((response) => response.json());
    var booksData = booksDataReq["results"];
    nextUrl = booksDataReq["next"];

    console.log(1, booksData);
    // пагинация
    // let pagination = 4;

    // первая загрузка бутылок
    booksData.slice(0, 4).forEach((element) => {
      var itemCard = renderItem(element, true);
      $("#preforms__container").append(itemCard);
      const button = itemCard.getElementsByClassName("add-to-busket-button")[0];
      button.addEventListener("click", addToCartClicked);
    });

    if (nextUrl === null) {
      console.log("Длинна массива books меньше пагинации");
      $(".load-more-button-three").hide();
      return;
    }
  });
});

function renderItem(book, isBootle) {
  var itemCard = document.createElement("div");
  itemCard.classList.add("col-lg-3");
  itemCard.classList.add("col-md-4");
  itemCard.classList.add("col-sm-6");
  itemCard.classList.add("bottles__col");

  const description = book.description
    .split(/\r?\n/)
    .filter((element) => element);
  var descr_tags = "";
  console.log("Split test!");

  const valueName = isBootle ? "Обьем" : "Диаметр";
  const valueMetric = isBootle ? "ml" : "mm";

  for (i = 0; i < description.length; i++) {
    descr_tags =
      descr_tags +
      `
    <li class="bottles__descr-info" style="list-style: none;"> ${description[i]} </li>
    `;

    console.log(i + " - " + description[i]);
  }

  itemCard.innerHTML = `

  <div class="bottles__card ">
    <div class="bottles__card-box ">
      <a href="http://89.111.133.194:8000/media/${book.img_name}" class="bottles__link " data-lightbox="roadtrip">
        <img
          class="bottles__card-img bottles__img"
          src="http://89.111.133.194:8000/media/${book.img_name}"
          alt="бутылка"
        />
      </a>
    </div>
   

    <div class="bottles__text">

      <h3 class="bottles__name">
        ${book.name}
      </h3>

      <p class="bottles__descr">
        <span class="bottles__descr-info">
          <span class="bottles__descr-name">Артикул:</span>
          ${book.article}
        </span>
      </p>

      <div class="bottles__descr">
      <ul class="opisanie" style="margin: 0;padding: 0;">
        <li class="bottles__descr-info" style="list-style: none;">
          <span class="bottles__descr-name"> Описание:</span>
        </li>
          ${descr_tags}
      </ul>
    </div>

      <p class="bottles__descr">
        <span class="bottles__descr-info">
        <span class="bottles__descr-name"> ${valueName}:</span>
         ${book.value_num} ${valueMetric}
        </span> 
      </p>

      <p class="bottles__descr bottles__count">
        <span class="bottles__descr-info">
        <span class="bottles__descr-name"> Минимальное количество: </span>
        ${book.min_count}
        </span>
      </p>

      <button class="add-to-busket-button btn-reset">
        Заказать
      </button>

    </div>
  </div>
  `;

  return itemCard;
}

// Корзина

// open cart modal
const cart = document.querySelector("#cart");
const cartModalOverlay = document.querySelector(".cart-modal-overlay");

cart.addEventListener("click", () => {
  if (cartModalOverlay.style.transform === "translateX(200%)") {
    cartModalOverlay.style.transform = "translateX(0)";
  } else {
    cartModalOverlay.style.transform = "translateX(200%)";
  }
});
// end of open cart modal

// close cart modal
const closeBtn = document.querySelector("#close-btn");

closeBtn.addEventListener("click", () => {
  cartModalOverlay.style.transform = "translateX(200%)";
});

cartModalOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-modal-overlay")) {
    cartModalOverlay.style.transform = "translateX(200%)";
  }
});

function addToCartClicked(event) {
  console.log("3");

  button = event.target;
  var cartItem = button.parentElement.parentElement.parentElement;
  // var price = cartItem.getElementsByClassName("product-price")[0].innerText;

  console.log(cartItem);
  var article = cartItem
    .getElementsByClassName("bottles__descr-info")[0]
    .innerText.substring(9);
  var title = cartItem.getElementsByClassName("bottles__name")[0].innerText;
  var imageSrc = cartItem.getElementsByClassName("bottles__img")[0].src;
  var min_count = cartItem
    .getElementsByClassName("bottles__count")[0]
    .innerText.substring(24);
  addItemToCart(article, imageSrc, title, min_count);
  updateCartPrice();
}

function addItemToCart(article, imageSrc, title, min_count) {
  var productRow = document.createElement("div");
  productRow.classList.add("product-row");
  var productRows = document.getElementsByClassName("product-rows")[0];
  var cartImage = document.getElementsByClassName("cart-image");

  for (var i = 0; i < cartImage.length; i++) {
    if (cartImage[i].src == imageSrc) {
      alert("Товар уже добавлен в корзину!");
      return;
    }
  }

  var cartRowItems = `
  <div class="product-row product-item">
        <img class="cart-image" src="${imageSrc}" alt="">
        <span class ="cart-title">${title}</span>
        <span class ="cart-price">${article}</span>
        <input class="product-quantity" min="${min_count}" step="10" type="number" value="${min_count}">
        <button class="remove-btn btn-reset">X</button>
  </div>

  `;

  productRow.innerHTML = cartRowItems;
  productRows.append(productRow);
  productRow
    .getElementsByClassName("remove-btn")[0]
    .addEventListener("click", removeItem);
  productRow
    .getElementsByClassName("product-quantity")[0]
    .addEventListener("change", changeQuantity);
  updateCartPrice();
}
// end of add products to cart

// Remove products from cart
const removeBtn = document.getElementsByClassName("remove-btn");
for (var i = 0; i < removeBtn.length; i++) {
  button = removeBtn[i];
  button.addEventListener("click", removeItem);
}

function removeItem(event) {
  btnClicked = event.target;
  btnClicked.parentElement.parentElement.remove();
  updateCartPrice();
}

// update quantity input
var quantityInput = document.getElementsByClassName("product-quantity")[0];

for (var i = 0; i < quantityInput; i++) {
  input = quantityInput[i];
  input.addEventListener("change", changeQuantity);
}

function changeQuantity(event) {
  var input = event.target;
  const minValue = Number(input.attributes[1].value);
  if (isNaN(input.value) || input.value < minValue) {
    input.value = minValue;
  }
}
// end of update quantity input

// update total price
function updateCartPrice() {
  const itemCount = document.getElementsByClassName("product-row").length / 2;
  document.getElementsByClassName("cart-quantity")[0].textContent = itemCount;
  if (itemCount > 0) {
    document.getElementsByClassName("purchase-btn")[0].disabled = false;
  } else {
    document.getElementsByClassName("purchase-btn")[0].disabled = true;
  }
}

//  форма корзины
var selector = document.querySelector("input[type='tel']");
var im = new Inputmask("+7(999)999-99-99");

im.mask(selector);

new JustValidate(".form-validate", {
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    tel: {
      required: true,
      function: (name, value) => {
        const phone = selector.inputmask.unmaskedvalue();
        return Number(phone) && phone.length === 10;
      },
    },
    mail: {
      required: true,
      email: true,
    },
  },
  messages: {
    name: "Вы не ввели имя",
    tel: "Вы не ввели телефон",
    mail: "Вы не ввели e-mail",
  },
  submitHandler: function (thisForm) {
    alert("Спасибо за покупку");
    cartModalOverlay.style.transform = "translateX(200%)";
    var cartItems = document.getElementsByClassName("product-rows")[0];

    let formData = new FormData(thisForm);

    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    object["items"] = new Array();

    var pis = document.getElementsByClassName("product-item");
    Array.prototype.forEach.call(pis, function (pi) {
      object["items"].push({
        name: pi.getElementsByClassName("cart-title")[0].innerText,
        article: pi.getElementsByClassName("cart-price")[0].innerText,
        count: pi.getElementsByClassName("product-quantity")[0].value,
      });
    });

    var json = JSON.stringify(object);
    console.log("ddcdc1", json);

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Отправлено");
        }
      }
    };

    xhr.open("POST", "php/item_mail.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);

    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }

    updateCartPrice();
    thisForm.reset();
  },
});

// Бургер-меню

let burger = document.querySelector(".burger");
let menu = document.querySelector(".header__nav");
let menuLinks = document.querySelectorAll(".nav__link");

burger.addEventListener("click", () => {
  burger.classList.toggle("burger--active");
  menu.classList.toggle("header__nav--active");
  document.body.classList.toggle("stop-scroll");
});

menuLinks.forEach((el) => {
  el.addEventListener("click", () => {
    burger.classList.remove("burger--active");
    menu.classList.remove("header__nav--active");
    document.body.classList.remove("stop-scroll");
  });
});

//переход
function scrollTo(hash) {
  location.hash = "#" + hash;
}

function scrollToAcnchor() {
  const hash = window.location.hash.substring(1);
  scrollTo("");
  scrollTo(hash);
  console.log("TEST !!!", hash);
}

setTimeout(scrollToAcnchor, 300);

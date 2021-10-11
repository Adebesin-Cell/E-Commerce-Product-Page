const form = document.querySelector(".form");
const plusBtn = document.querySelector(".form-group__icon--plus");
const minusBtn = document.querySelector(".form-group__icon--minus");
const inputEl = document.querySelector(".form__input");
const cartBtn = document.querySelector(".header__cart-icon");
const cartListEl = document.querySelector(".cart__list");
const cartBody = document.querySelector(".cart__body");
const cartEl = document.querySelector(".cart");
const cartCounter = document.querySelector(".header__cart-tooltip span");

let counter = 0;
let cart = [];

cartCounter.textContent = cart.length;

cartBtn.addEventListener("click", function () {
  if (cartBtn.classList.contains("active")) {
    cartBtn.classList.remove("active");
    cartEl.classList.add("cart--hidden");
  } else {
    cartBtn.classList.add("active");
    cartEl.classList.remove("cart--hidden");
  }
});

const decrementCounter = function () {
  if (counter === 0) return;
  counter--;
  inputEl.value = counter;
  inputEl.setAttribute("data-value", counter);
};

const incrementCounter = function () {
  counter++;
  inputEl.value = counter;
  inputEl.setAttribute("data-value", counter);
};

const resetCounter = function () {
  counter = 0;
  inputEl.value = counter;
  inputEl.setAttribute("data-value", counter);
};

plusBtn.addEventListener("click", incrementCounter);
minusBtn.addEventListener("click", decrementCounter);

const addCart = function (data) {
  const cartData = {
    id: Date.now(),
    ...data,
  };
  cart.push(cartData);
  localStorage.setItem("carts", JSON.stringify(cart));

  renderCart(cartData);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (+inputEl.value === 0) return;
  const inputValue = +inputEl.value.trim();

  const image = e.target
    .closest(".products-view__wrapper")
    .querySelector(".products-view__image").src;

  const price = +e.target
    .closest(".products-view__wrapper")
    .querySelector(".products-view__price--main")
    .textContent.trim()
    .slice(1, "".lastIndexOf("."));

  const totalPrice =
    +e.target
      .closest(".products-view__wrapper")
      .querySelector(".products-view__price--main")
      .textContent.trim()
      .slice(1, "".lastIndexOf(".")) * +inputEl.value;

  const title = e.target
    .closest(".products-view__wrapper")
    .querySelector(".products-view__image").alt;

  addCart({ title, totalPrice, price, image, value: inputValue });

  cartEl.classList.remove("empty");
  cartCounter.textContent = cart.length;
  resetCounter();
});

const renderCart = function ({
  image,
  id,
  title,
  price,
  totalPrice,
  value,
  deleted,
}) {
  localStorage.setItem("carts", JSON.stringify(cart));

  const cartItem = document.querySelector(`[data-id = '${id}']`);

  if (deleted) {
    cartItem.remove();
    return;
  }

  const html = `
        <li class="cart__item" id=${id} data-id=${id}>
            <div class="cart__wrapper">
                <div class="cart__image-box">
                <img
                    src=${image}
                    alt="${title}"
                    class="cart__image"
                />
                </div>
                <div class="cart__description">
                <h1 class="cart__title">
                    ${title}
                </h1>
                <p class="cart__details">
                    <span class="cart__price"> $${price} </span>
                    <span> x </span>
                    <span class="cart__number"> ${value} </span>
                    <span class="cart__total-price"> $${totalPrice} </span>
                </p>
                </div>
                <div class="cart__action">
                <button class="cart__delete">
                    <svg
                    width="14"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                    <defs>
                        <path
                        d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"
                        id="a"
                        />
                    </defs>
                    <use
                        fill="#C3CAD9"
                        fill-rule="nonzero"
                        xlink:href="#a"
                    />
                    </svg>
                </button>
                </div>
            </div>
            <button type="button" class="cart__btn">Checkout</button>
        </li>`;
  cartListEl.insertAdjacentHTML("beforeend", html);
};

document.addEventListener("DOMContentLoaded", function () {
  const items = localStorage.getItem("carts");
  if (items) {
    const carts = JSON.parse(items);

    if (carts.length > 0) {
      carts.forEach((cart) => {
        renderCart(cart);
      });

      cartEl.classList.remove("empty");
      cartCounter.textContent = carts.length;
    } else {
      cartEl.classList.add("empty");
    }
  }
});

cartEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("cart__delete")) {
    const key = e.target.closest(".cart__item").dataset.id;
    deleteCartItem(key);
  }
});

const deleteCartItem = function (key) {
  const i = cart.findIndex((cartItem) => cartItem.id === Number(key));
  const cartItem = {
    deleted: true,
    ...cart[i],
  };

  cart = cart.filter((cartItem) => cartItem.id !== +key);
  cartCounter.textContent = cart.length;

  if (cart.length === 0) {
    cartEl.classList.add("empty");
  }
  renderCart(cartItem);
};

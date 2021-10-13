//selecting elements
const body = document.querySelector("body");
const form = document.querySelector(".form");
const plusBtn = document.querySelector(".form-group__icon--plus");
const minusBtn = document.querySelector(".form-group__icon--minus");
const cartBtn = document.querySelector(".header__cart-icon");
const cartListEl = document.querySelector(".cart__list");
const inputEl = document.querySelector(".form__input");
const cartBody = document.querySelector(".cart__body");
const cartEl = document.querySelector(".cart");
const cartCounter = document.querySelector(".header__cart-tooltip span");
const menuCloseBtn = document.querySelector(".menu__close");
const menu = document.querySelector(".menu");
const menuOpenBtn = document.querySelector(".header__menu-toggle");
const menuOverlay = document.querySelector(".menu__overlay");
const mobileSlides = document.querySelectorAll(".products-view__slider-box");
const mobileNextBtn = document.querySelector(".products-view__next");
const mobilePrevBtn = document.querySelector(".products-view__previous");
const slides = document.querySelectorAll(".lightbox__slides");
const nextBtn = document.querySelector(".lightbox__nav--next");
const prevBtn = document.querySelector(".lightbox__nav--prev");
const thumbnailsContainer = document.querySelector(".thumbnails");
const closeLightboxBtn = document.querySelector(".lightbox__close svg");
const lightbox = document.querySelector(".lightbox");
const lightBoxOverlay = document.querySelector(".lightbox__overlay");
const mainImage = document.querySelector(".products-view__image");
const allImages = document.querySelectorAll(".products-view__box");
const imageContainer = document.querySelector(".products-view__overview");

//states
let currentMobileSlide = 0;
const mobileSlidesLength = mobileSlides.length;
let counter = 0;
let currentBanner = 0;
let cart = [];
cartCounter.textContent = cart.length;
let currentSlide = 0;
const SliderMaxLength = slides.length;

cartBtn.addEventListener("click", function () {
  if (cartBtn.classList.contains("active")) {
    cartBtn.classList.remove("active");
    cartEl.classList.add("cart--hidden");
  } else {
    cartBtn.classList.add("active");
    cartEl.classList.remove("cart--hidden");
  }
});

const closeMenu = function () {
  menu.classList.add("menu--hidden");
  menuOverlay.classList.add("hidden");
  body.classList.remove("no-scroll");
};

const openMenu = function () {
  menu.classList.remove("menu--hidden");
  menuOverlay.classList.remove("hidden");
  body.classList.add("no-scroll");
};

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
  renderCart(cartData);
};

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
  if (!items || JSON.parse(items).length === 0) {
    cartEl.classList.add("empty");
    return;
  }
  cart = JSON.parse(items);

  cart.forEach((cart) => {
    renderCart(cart);
  });

  cartEl.classList.remove("empty");
  cartCounter.textContent = cart.length;
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

  cart = cart.filter((cartItem) => cartItem.id !== Number(key));
  cartCounter.textContent = cart.length;

  if (cart.length === 0) {
    cartEl.classList.add("empty");
  }

  renderCart(cartItem);
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

const goToSlide = function (slide) {
  slides.forEach(function (s, _) {
    s.style.display = "none";
    slides[slide].style.display = "block";
  });
};

const prevSlide = function () {
  prevBtn.classList.add("active");
  nextBtn.classList.remove("active");
  if (currentSlide === 0) {
    currentSlide = SliderMaxLength - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};

const nextSlide = function () {
  prevBtn.classList.remove("active");
  nextBtn.classList.add("active");
  if (currentSlide === SliderMaxLength - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
};

goToSlide(0);

thumbnailsContainer.addEventListener("click", function (e) {
  document.querySelectorAll(".thumbnails__image").forEach((img) => {
    img.classList.remove("active");
  });
  if (e.target.classList.contains("thumbnails__image")) {
    const { thumbnail } = e.target.dataset;
    e.target.classList.add("active");
    nextBtn.classList.remove("active");
    prevBtn.classList.remove("active");
    goToSlide(thumbnail - 1);
  }
});

const closeLightbox = function () {
  lightbox.classList.add("lightbox--hidden");
  lightBoxOverlay.classList.add("hidden");
};

const openLightBox = function () {
  lightbox.classList.remove("lightbox--hidden");
  lightBoxOverlay.classList.remove("hidden");
};

const showSlide = function (slide) {
  mobileSlides.forEach(function (s, _) {
    s.style.display = "none";
    mobileSlides[slide].style.display = "block";
  });
};

const goToPrevSlide = function () {
  mobilePrevBtn.classList.add("active");
  mobileNextBtn.classList.remove("active");
  if (currentMobileSlide === 0) {
    currentMobileSlide = mobileSlidesLength - 1;
  } else {
    currentMobileSlide--;
  }
  showSlide(currentMobileSlide);
};

const goToNextSlide = function () {
  mobileNextBtn.classList.add("active");
  mobilePrevBtn.classList.remove("active");
  if (currentMobileSlide === mobileSlidesLength - 1) {
    currentMobileSlide = 0;
  } else {
    currentMobileSlide++;
  }
  showSlide(currentMobileSlide);
};

showSlide(0);

const gotoBanner = function (banner) {
  allImages.forEach((image) => {
    image.classList.remove("active");
    allImages[banner].classList.add("active");
  });

  const index = allImages[banner].querySelector(".products-view__image").dataset
    .lightbox;

  mainImage.src = `assets/images/image-product-${index}.jpg`;
};

gotoBanner(0);

imageContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("products-view__image")) {
    const index = e.target.dataset.lightbox;
    gotoBanner(index - 1);
  }
});

//event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
closeLightboxBtn.addEventListener("click", closeLightbox);
mainImage.addEventListener("click", openLightBox);
lightBoxOverlay.addEventListener("click", closeLightbox);
mobileNextBtn.addEventListener("click", goToNextSlide);
mobilePrevBtn.addEventListener("click", goToPrevSlide);
menuOpenBtn.addEventListener("click", openMenu);
menuCloseBtn.addEventListener("click", closeMenu);

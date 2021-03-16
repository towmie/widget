"use strict";

const newsList = document.querySelector(".widget__list");
const newsBtn = document.querySelector(".news__btn");
const widget = document.querySelector(".widget");
const newsAmount = document.querySelector(".news-amount");
let amount = 0;

// Получаем ифно с API

async function getApi() {
  try {
    const response = await fetch(
      "https://api.currentsapi.services/v1/latest-news?language=ru&apiKey=tvf7Xbrnpe9cglOvsSP4OKryB1b9-S8edbs_VU7U-1VxoJgo"
    );
    if (!response.ok) throw new Error("Какие-то проблемы...");

    const data = await response.json();

    newsBtn.classList.remove("hide");
    updateUi(data);
  } catch (err) {
    console.log(err.message);
  }
}
getApi();

//Создаем отдельную новоть

function createNewsItem({ title, author, published, url, id }) {
  const date = published.split(" ")[0];
  const time = published.split(" ")[1];
  const html = `
        <li class="widget__item" data-id="${id}">
          <div class="widget__item-header">
            <h3 class="widget__item-title">${title}</h3>
            <p class="widget__sub-header">
              Автор: <span class="widget__item-author">${author}</span>
            </p>
            <p class="widget__sub-header">
              Дата: <span class="widget__item-author">${date}, ${time}</span>
            </p>

          </div>
          <a href="${url}" class="widget__link" target="_blank">Узнать подробнее</a>
          <span class="is-read">Прочитано</span>
        </li>
    `;
  newsList.insertAdjacentHTML("afterbegin", html);
}

// Рендерим список новостей

function renderNews({ news }) {
  news.forEach((el) => createNewsItem(el));
}

// Показываем/ скрываем виджет

function revealOrHideWidget(e) {
  e.preventDefault();
  widget.classList.toggle("hide");
}

// Обновляем интерфейс

function updateUi(data) {
  renderNews(data);

  amount = data.news.length;
  showNewsAmount(amount);
}

// добавляем класс прочитано

function addAlreadyRead({ target }) {
  if (target.closest(".widget__item").classList.contains("widget__item--read"))
    return false;

  amount--;
  showNewsAmount(amount);

  if (!target.classList.contains("widget__link")) return;
  target.closest(".widget__item").classList.add("widget__item--read");
  target.nextElementSibling.classList.add("is-read--active");
}

// количество непросмотренных новостей

function showNewsAmount(amount) {
  if (amount === 0) return;
  newsAmount.textContent = amount;
}

// События

newsBtn.addEventListener("click", revealOrHideWidget);

newsList.addEventListener("click", addAlreadyRead);

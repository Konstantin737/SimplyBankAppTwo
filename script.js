'use strict';

///////////////////////////////////////
// Modal window

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll('.btn--show-modal-window');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button => button.addEventListener('click', openModalWindow));


btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});



//Имплементирую мягкое прокручивание


btnScrollTo.addEventListener('click', function(e) {
  const section1Coords = section1.getBoundingClientRect();
  // console.log(section1Coords);//получил расположение секции 1
  // console.log(e.target.getBoundingClientRect());//расположение самой кнопки btnScrollTo
  // console.log('Текущее прокручивание: x, y,', window.pageXOffset, window.pageYOffset);//координаты прокручивания по y будут менятся по нажатию на кнопку
  // console.log('Ширина и высота viewPort', document.documentElement.clientWidth, document.documentElement.clientHeight);//в консоль выводится ширина и высота окна по нажатию на кнопку

  // //переход по координатам без мягкости
  // window.scrollTo(
  //   section1Coords.left + window.pageXOffset, 
  //   section1Coords.top + window.pageYOffset
  // );//указываю координаты выбранной секции1 const section1Coords = section1.getBoundingClientRect();, но чтоб перемещатся к секции 1 по нажатию на кнопку из любого ее положения нам надо прибавлять текущую ее позицию по горизонтали window.pageXOffset и по вертикали window.pageYOffset

  //Мягкий переход(помещаю конструкцию в объект, олдскульный способ)
  window.scrollTo({
    left: section1Coords.left + window.pageXOffset, 
    top: section1Coords.top + window.pageYOffset,
    behavior: 'smooth'
  });

  // //Новый способ перемещения
  // section1.scrollIntoView({behavior: 'smooth'});//работает только в современных браузерах

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Плавная навигация по странице

// document.querySelectorAll('.nav__link').forEach(function(htmlElement) {
//   htmlElement.addEventListener('click', function(e) {
//     e.preventDefault();//теперь не будем перемещатся по href, дефолтное поведение
//     const href = this.getAttribute('href');//получили атрибут href блока с классом .nav__link
//     document.querySelector(href).scrollIntoView({behavior: 'smooth'});//выбрал полученый в href(получаем в зависимости от того на что кликнули) элемент и прикрепил к нему метод плавного прокручивания
//     console.log(href);//проверяю прикрепилось ли ко всем эл панели навигации
//   })
//   но есть проблема в таком способе, если у нас будет 10тыс таких элементов, то одна и та же функция пропишется к каждому элементу и это вызовет проблемы с производительностью, нам надо прикрепить addEventListener не к самим элементам а к их общему родителю, а понимать на каком именно элементе мы кликнули будет e.target
// })
  //Делегирование событий
  //1.Приерепляем слушатель событий addEventListener для общего родителя
document.querySelector('.nav__links').addEventListener('click', function(e) {//по е получаем доступ к target
  e.preventDefault();
  //2.Определить target элемент
  console.log(e.target);//проверяю происходит ли выбор нужного эл. по клику
  if (e.target.classList.contains('nav__link')) { //провер. является ли эл. клика nav__link-ом и выполняем переход
    const href = e.target.getAttribute('href');//получили атрибут href блока с классом .nav__link
    document.querySelector(href).scrollIntoView({behavior: 'smooth'});
  }
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Вкладки

const tabs = document.querySelectorAll('.operations__tab');
const tabConteiner = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabConteiner.addEventListener('click', function(e) {
  e.preventDefault();
  const clickedButton = e.target.closest('.operations__tab');//помещаю в эту перем. ту кнопку по котор. кликнул в род. элементе tabConteiner, будет выбран ближайший элемент, это делаем из за того, что в кнопке может лежать еще какой то элемент кликая на который, мы будем получать его.

  ////Guard clause - пункт охраны своеобразный, проверяет на правильность
  if(!clickedButton) return; //если кликнуть не по кнопке а по родителю, то мы вернемся из EventListener-а
  ////
  
  //Активная вкладка
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');
  
  //Активный контент
  tabContents.forEach(cont => cont.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
})


//Анимация потускнения на панели навигации

const navLinksHoverNavigation = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(el => {
      if(el !== linkOver) el.style.opacity = opacity;
    })
    logo.style.opacity = opacity;
    logoText.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', function(e) {
  navLinksHoverNavigation(e, 0.4)
})

nav.addEventListener('mouseout', function(e) {
    navLinksHoverNavigation(e, 1);
})


//Sticky Navigation
//Будем добавлять этот класс по событию прокручивания
// из за scroll падает производительность приложения
// const section1Coords = section1.getBoundingClientRect(); //отсюда получил значение y первой секции


// window.addEventListener('scroll', function(e) {
//   console.log(window.scrollY);
//   if(window.scrollY > section1Coords.top) {
//     nav.classList.add('sticky');//добавляем класс если условие выполняется
//   } else {
//     nav.classList.remove('sticky');
//   }
// })

//Sticky Navigation
// но при помощи Intersection Observer API(наблюдает за пересечением когда опред. элементы пересекают другие)

const header = document.querySelector('.header');

const getStickyNav = function(entries) {
  const entry = entries[0];
  if(entry.isIntersecting === false) { //когда isIntersecting=false, header ушел из поля видимости мы начинаем видеть панель навигации
    nav.classList.add('sticky');
  } else {
  nav.classList.remove('sticky'); //когда isIntersecting=true, header вошел в поле видимости панель исчезает
  }
}

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0, //будем показывать панель навигации, когда header будет не видим
  rootMargin: '-300px' //это отступ в -300 пикселей до таргет элемента, где покажется панель навигации, тоесть наш header как бы уменьшится на 300px, если без минуса то увеличится, и панель будет не появлятся дольше
});
headerObserver.observe(header);


//Появление секций сайта при прокрутке(вначале програмно добавил ко всем секциям сайта подкласс section--hidden и теперь при прокрутке буду его убирать, плюс немного поднимать заголовки)

const allSection = document.querySelectorAll('.section')
const apperanceSection = function(entries, observer) {
  const entry = entries[0];
  // console.log(entry);
  if(entry.isIntersecting === true) { //это усл. из за того что первый блок был виден сразу из за сраб. ф-ции
    entry.target.classList.remove('section--hidden');
    // теперь когда мы удалим все section--hidden нужно удалить обозреватель с помощью unobserve
    observer.unobserve(entry.target);
  }
}

const sectionoObserver = new IntersectionObserver(apperanceSection, {
  root: null,
  threshold: 0.2, //20% чтоб часть которую мы достигнем появлялась не сразу
});

allSection.forEach(function(section) {
  sectionoObserver.observe(section);
  section.classList.add('section--hidden');//добавляю невидимость програмно, без js все будет видно сразу
})




//Имплементация ленивой загрузки изображений Lazy Loading

const lazyImages = document.querySelectorAll('img[data-src]')//выбираю все изображения img в которых есть data-src
// console.log(lazyImages); проверил, действительно выбралось то что мне надо

const loadImages = function(entries, observer) {//
  const entry = entries[0]; // получаем из entries первый элемент в котором isIntersecting: false и дойдя до картинки мы получим isIntersecting: true
  // console.log(entries);
  if(entry.isIntersecting === false) return;
  //Меняем изображение с высоким разрешением
  // console.log(entry.target);//тут лежит сам получаемый элемент - картинка низкого разрешения с блюром
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img'); //так блюр будет сниматся без слущю события load

  //Можно слушать событие load и не снимать класс с блюром lazy-img пока изображение не загрузится
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);//отключаем отслеживание после загрузки изображений
}

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.5,
  // rootMargin: '200px', //если вкл эту опцию, то изображение будет подгружатся раньше и появлятся четким
});// обзервер картинок в поле видимости

lazyImages.forEach(image => lazyImagesObserver.observe(image));//загружаю каждую картинку в созданный обзервер




////////////////////////////////////////////////////////////////////////////////////////////////////////
//Создание слайдера

const slides = document.querySelectorAll('.slide'); //выбрал все слайды
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotConteiner = document.querySelector('.dots');

let currentSlide = 0;
const sliderNumber = slides.length - 1;//иначе будет +1 прокрутка из за 0 индекса

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(1000px)';
// slider.style.overflow = 'visible';

//Создание точек
const createDots = function() {
  slides.forEach(function(_, index) {
    dotConteiner.insertAdjacentHTML('beforeend', `<button class = "dots__dot" data-slide  = "${index}"></button>`);
  })   
}
createDots();


const moveToSlide = function(slide) {
  slides.forEach((s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`));
  //1 слайд = -100%, 2 слайд = 0%, 3 слайд = 100%, 4 слайд = 200%
}

moveToSlide(0);

const rigtSlide = function() {
  if(currentSlide === sliderNumber) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
}

const leftSlide = function() {
  if(currentSlide === 0) {
    currentSlide = sliderNumber;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
}


btnRight.addEventListener('click', rigtSlide) //перемещение вправо
btnLeft.addEventListener('click', leftSlide) //перемещение вплево

//Перемещение слайдера по нажатию на клавиатуру
document.addEventListener('keydown', function(e) {
  if(e.key === 'ArrowRight') {
    rigtSlide();
  } else if (e.key === 'ArrowLeft') {
    leftSlide();
  }
})

//Имплементирую клик по точкам слайдера
dotConteiner.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    // console.log('Dot was clicked');
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
})

//Функция индикации текущей точки
const activateCurrentDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active')
}

activateCurrentDot(0);//после перезагрузки страницы точка будет гореть на активном слайде


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelector('.header'));
// const sections = document.querySelectorAll('.section');
// console.log(sections);

// console.log(document.getElementById('section--1'));

// const buttons = document.getElementsByTagName('button'); // поместит все кнопки в html collection который обновляется автоматически, например при удалении одной из button
// console.log(buttons);

// console.log(document.getElementsByClassName('btn'));


// //Создание и вставка элементов
// // .insertAdjacentHTML()

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'Мы используем на этом сайте cookie для улучшения функциональности.'
// message.innerHTML = 'Мы используем на этом сайте cookie для улучшения функциональности.<button class="btn btn--close-cookie">Ok!</button>';

// const header = document.querySelector('.header');
// header.prepend(message);//при помощи этого метода добавляем новый элемент первым в header
// // header.append(message.cloneNode(true));//при помощи этого метода добавляем новый элемент последним в header, cloneNode(true), сделает копию элемента message иначе бы сверху элемент исчез
// // header.before(message);//при помощи before элемент появится над header
// // header.after(message);//при помощи after элемент появится после header

// //Удаление элементов
// document.querySelector('.btn--close-cookie').addEventListener('click', function() {
//   message.remove();
//   // //раньше удаление писалось через родительский элемент
//   // message.parentElement.removeChild(message);
// })

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Стили
// message.style.backgroundColor = '#076785';
// message.style.color = 'white';
// message.style.width = '90%'
// console.log(message.style.width);//мы увидим в консоле тк мы его установили сами
// console.log(message.style.backgroundColor);
// //если мы хотим увидеть цвет установленный в стилях css
// console.log(getComputedStyle(message).color);
// //или все стили
// console.log(getComputedStyle(message));
// //используя это мы можем увеличить ее ширину(например)
// message.style.height = Number.parseFloat(getComputedStyle(message).height) + 50 +'px';//убрали px от ширины полученной из стилей при помощи parseFloat, сделали числом Number добавили 50 и прибавили px = 93px

// //изменение переменных в css (background-color: var(--color-first);) везде где используется этот цвет он изменится
// //но и обычные св-ва мы так же можем менять при помощи setProperty
// document.documentElement.style.setProperty('--color-first', '#5eeee7')


// //атрибуты
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// // logo.alt = 'Лого Не Простого Банка';//перепишет атрибут alt
// console.log(logo.getAttribute('developer'));//так мы можем получить доступ к не стандартному атрибуту 
// logo.setAttribute('copyright', 'Masters of Code');//создаем новый атрибут у logo

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);// получаем относительный путь URL
// console.log(link.getAttribute('href'));// тут получаем абсолютный путь URL


// //Data atributs(всегда начинаются с data)используют с работой с юзер интерфейсом
// console.log(logo.dataset.versionNumber);//в css так data-version-number="2.0", version-number = versionNumber

// //Classes
// logo.classList.add('a', 'b');//добавить класс
// logo.classList.remove('a', 'b');//удалить класс
// logo.classList.toggle('a');//переключить класс
// logo.classList.contains('c');//проверять на содержание в списке классов какого то класса

// //не использовать, будет полностью переустановленны все классы на этот один
// // logo.className = 'a'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Виды событий и обработчиков событий(JS events самые популярные keyboard и mouse)

// const h1 = document.querySelector('h1');
// h1. addEventListener('mouseenter', function(e){ // это событине наведения курсора мыши(hover)
//   alert('addEventListener: You are now at the h1 element')
// })

// h1.onmouseenter = function(e){ // это событине наведения курсора мыши(hover)
//   alert('onmouseenter: You are now at the h1 element')

// h1.onclick = function(e){//это событине клик курсора мыши(hover) //это олдскульный способ, новый addEventListener
//   alert('oneclick: You have clicked the h1 element');
// };


// //занес функцию в отдельную переменную
// const alertMouseEnterH1 = function(e) {
//   alert('addEventListener: You are now at the h1 element');
//   h1.removeEventListener('mouseenter', alertMouseEnterH1);//после срабатывания этой функции, обработчик событий 'mouseenter' будет удален для заголовка h1
// }

// //записал переменную с функцией в обработчик событий
// h1.addEventListener('mouseenter', alertMouseEnterH1);

// // можно удалять обработчик события по истечению какого-то времени(3сек), через setTimeout
// setTimeout(() => h1.removeEventListener('mouseenter', alertMouseEnterH1), 3000)

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //Распространение событий, фаза перехват и всплытие
// //Event Propagation
// // rgb (123, 56, 78)

// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const getRandomColor = () => `rgb(${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(0, 255)})`

// console.log(getRandomColor());

// //прикрепим обработчики событий ко всем элементам панели навигации
// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   // console.log('Click the link!');//по нажатию на это будет выводится сразу три 'Click the link!'
//   this.style.backgroundColor = getRandomColor();//фон кнопки будет менятся на случайный цвет по клику и все элементы выше по иерархии к которым прикреплены обработчики событий тоже будут менять цвет
//   console.log('link:', e.target); //покажет сам элемент по которому произошел ивент клика, сам элемент
//   e.stopPropagation();//теперь родительские элементы уже не будут реагировать на клик по ребенку
// })
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('links:', e.target);
// })
// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('nav:', e.target);
// }, true //теперь поведение элемента не дефолтное и он реагирует на событие уже на фазе перехвата, и по клику на .nav__link, который ниже, будет стоять выше него, потому что по дороге к .nav__link мы проходим по нему первым, так уже не делают, на фазе перехвата события не используют
// )

// document.querySelector('body').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor(); //при клике на него будет менять цвет только он, так как выше в иерархрр обработчиков событий на клик не найдет
//   console.log('body:', e.target);
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //Перемещение по DOM(DOM traversing)

// const h1 = document.querySelector('h1')

// //Перемещение вниз от родителя к потомку
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);//отобразит только прямых потомков, если бы мы вложили что то в него, то HTMLCollection(3) [span.highlight, br, span.highlight] уже бы не отобразились
// console.log(h1.firstElementChild);//выводит самый первый элемент потомок
// h1.firstElementChild.style.color = 'yellow';//первый элемент потомка станет желтым
// h1.lastElementChild.style.color = 'yellow';//последний элемент потомка станет желтым

// //Перемещение вверх от потомков к родителям
// console.log(h1.parentNode);//получим один и тот же элемент div.header__title
// console.log(h1.parentElement);

// const h2 = document.querySelector('h2');
// h2.closest('.section').style.backgroundColor = 'blue'; //закрасит в синий первую найденную секцию в которой лежит h2, на ближайшую укажет метод closest, ближайший элемент с классом section к h2


// //Sticky Navigation
// // но при помощи Intersection Observer API(наблюдает за пересечением когда опред. элементы пересекают другие)

// const observerCallBack = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }
// const observerOptions = {
//   root: null,// так мы будем наблюдать за всем viewport, текущая видимю часть страницы
//   threshold: [0, 0.2],//в двух положениях экрана isIntersecting: true = intersectionRatio: 0 и isIntersecting: true = intersectionRatio: 0.2
// };
// const observer = new IntersectionObserver(observerCallBack, observerOptions);
// observer.observe(section1);







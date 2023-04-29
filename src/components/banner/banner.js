import Swiper, { Navigation } from 'swiper';
import 'swiper/css';

document.querySelectorAll('.js-banner-slider').forEach(element => {
  const slider = element.querySelector('.swiper');
  const btnPrev = element.querySelector('.swiper-button-prev');
  const btnNext = element.querySelector('.swiper-button-next');

  new Swiper(slider, {
    navigation: {
      prevEl: btnPrev,
      nextEl: btnNext
    },
    modules: [Navigation]
  });
});
// swiper相关
initSwiper()
function initSwiper() {
  let imgthumbSwiper, imgboxSwiper;
  imgthumbSwiper = new Swiper(".imgthumb_swiper", {
    loop: true,
    spaceBetween: 8,
    slidesPerView: 4,
    navigation: {
      nextEl: ".imgthumb_swiper .imgthumb_swiper_next",
      prevEl: ".imgthumb_swiper .imgthumb_swiper_prev",
    },
  });
  imgboxSwiper = new Swiper(".imgmain_swiper", {
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    spaceBetween: 0,
    navigation: {
      nextEl: ".imgthumb_swiper_box .imgmain_swiper_next",
      prevEl: ".imgthumb_swiper_box .imgmain_swiper_prev",
    },
    thumbs: {
      swiper: imgthumbSwiper,
    },
  });
}
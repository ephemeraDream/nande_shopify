// swiper相关
initSwiper()
function initSwiper() {
  let imgthumbSwiper, imgboxSwiper;
  imgthumbSwiper = new Swiper(".imgthumb_swiper", {
    loop: true,
    spaceBetween: 8,
    slidesPerView: 4,
    navigation: {
      nextEl: ".imgthumb_swiper_box .imgthumb_swiper_next",
      prevEl: ".imgthumb_swiper_box .imgthumb_swiper_prev",
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
      nextEl: ".imgmain_swiper .imgmain_swiper_next",
      prevEl: ".imgmain_swiper .imgmain_swiper_prev",
    },
    thumbs: {
      swiper: imgthumbSwiper,
    },
  });
}
// 优惠倒计时
const sale_info_box = document.querySelector(".product_info_saleinfo")
if (sale_info_box) {
  const endDateStr = sale_info_box.querySelector(".product_info_saleinfo_countdown").getAttribute('data-end-date');
  const endDate = new Date(endDateStr);

  const updateCountdownInnerHTML = (days, hours, minutes, seconds) => {
    if (days > 0) {
      sale_info_box.querySelector(".product_info_saleinfo_countdown_item[data-type='day']").innerHTML = String(days).padStart(
        2,
        '0'
      );
    }
    sale_info_box.querySelector(".product_info_saleinfo_countdown_item[data-type='hour']").innerHTML = String(hours).padStart(
      2,
      '0'
    );
    sale_info_box.querySelector(".product_info_saleinfo_countdown_item[data-type='minute']").innerHTML = String(
      minutes
    ).padStart(2, '0');
    sale_info_box.querySelector(".product_info_saleinfo_countdown_item[data-type='second']").innerHTML = String(
      seconds
    ).padStart(2, '0');

    if (days == 0 && sale_info_boxquerySelector(".product_info_saleinfo_countdown_item[data-type='day']")) {
      sale_info_boxquerySelector(".product_info_saleinfo_countdown_item[data-type='day'] + span").remove();
      sale_info_boxquerySelector(".product_info_saleinfo_countdown_item[data-type='day']").remove();
    }
  };

  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;
    let days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0;

    if (diff <= 0) {
      updateCountdownInnerHTML(days, hours, minutes, seconds);
      return;
    }

    days = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((diff / (1000 * 60)) % 60);
    seconds = Math.floor((diff / 1000) % 60);

    updateCountdownInnerHTML(days, hours, minutes, seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  document.querySelector(".product_info_saleinfo_btn").addEventListener('click', async (e) => {
    const code = e.target.getAttribute('data-code');
    await navigator.clipboard.writeText(code);

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Copied';

    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 5000);
  });
}
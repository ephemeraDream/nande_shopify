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
      document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='day']").forEach(item => item.innerHTML = String(days).padStart(2, '0'))
    }
    document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='hour']").forEach(item => item.innerHTML = String(hours).padStart(2, '0'));
    document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='minute']").forEach(item => item.innerHTML = String(minutes).padStart(2, '0'));
    document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='second']").forEach(item => item.innerHTML = String(seconds).padStart(2, '0'));

    if (days == 0 && document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='day']")) {
      document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='day'] + span").forEach(item => item.remove());
      document.querySelectorAll(".product_info_saleinfo_countdown_item[data-type='day']").forEach(item => item.remove());
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

    const originalText = e.target.innerHTML;
    e.target.innerHTML = 'Copied';

    setTimeout(() => {
      e.target.innerHTML = originalText;
    }, 5000);
  });
}
// feature弹窗
const key_features_modal = document.querySelector(".key_features_modal");
if (key_features_modal) {
  document
    .querySelector(".product_info_key_features")
    .addEventListener("click", () => {
      key_features_modal.style.display = "block";
      document.body.style.overflowY = "hidden";
    });
  key_features_modal
    .querySelector(".common_modal_close")
    .addEventListener("click", () => {
      key_features_modal.style.display = "none";
      document.body.style.overflowY = "auto";
    });
  key_features_modal.addEventListener("click", (e) => {
    if (e.target === key_features_modal) {
      key_features_modal.style.display = "none";
      document.body.style.overflowY = "auto";
    }
  });
}
// 信息弹窗
document.querySelectorAll(".product_info_modal_item").forEach(item => {
  item.addEventListener("click", () => {
    const modal = item.querySelector(".common_modal")
    modal.style.display = "block";
    document.body.style.overflowY = "hidden";

    modal
      .querySelector(".common_modal_close")
      .addEventListener("click", (e) => {
        e.stopPropagation()
        modal.style.display = "none";
        document.body.style.overflowY = "auto";
      });
    modal.addEventListener("click", (e) => {
      e.stopPropagation()
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflowY = "auto";
      }
    });
  })
})
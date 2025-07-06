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
//底部悬浮窗展示监测判断
toggleBottomBar();
function toggleBottomBar() {
  const targetSelector = ".product_info_section";
  const bottomBar = document.querySelector(".product_info_bottom_bar");

  if (!bottomBar) return;

  function initObserver(target, threshold) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bottomBar.style.zIndex = -1;
            bottomBar.style.opacity = 0;
          } else {
            bottomBar.style.zIndex = 99;
            bottomBar.style.opacity = 1;
          }
        });
      },
      {
        root: null,
        threshold: threshold,
      }
    );

    observer.observe(target);
  }

  waitForElement(targetSelector, (target) => {
    initObserver(target, 0.4);
  });
}
// 等待元素dom加载
function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
// 产品媒体切换
document.querySelectorAll(".product_info_left_thumb_select_item").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");

    document.querySelectorAll(".product_info_left_thumb_select_item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const imgthumb_swiper_box = document.querySelector(".imgthumb_swiper_box")
    if (type === "image") {
      imgthumb_swiper_box.style.opacity = 1
    } else {
      imgthumb_swiper_box.style.opacity = 0
    }

    document.querySelectorAll(".product_info_left_contain_group").forEach(group => {
      group.dataset.type === type ? group.classList.add("show") : group.classList.remove("show");
    });
  });
});
// 数量切换&加购和购买
initBuybox();
function initBuybox() {
  // 数量切换
  const quantityInput = document.querySelector(".product_info_buybox_quantity_input");
  document
    .querySelectorAll(".product_info_buybox_quantity_btn")
    .forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const type = btn.getAttribute("data-type");
        const quantity = Number(quantityInput.value);
        if (type === "minus" && quantity > 1) {
          quantityInput.value = quantity - 1;
        }
        if (type === "plus" && quantity < 20) {
          quantityInput.value = quantity + 1;
        }
      });
    });
  if (quantityInput) {
    quantityInput.addEventListener("input", function (event) {
      let value = quantityInput.value.replace(/\D/g, "");
      if (value === "") {
        quantityInput.value = value;
        return;
      }

      value = Math.max(1, Math.min(10, parseInt(value, 20)));
      quantityInput.value = value;
    });

    quantityInput.addEventListener("blur", function () {
      let value = quantityInput.value.replace(/\D/g, "");
      if (value == "") {
        quantityInput.value = 1;
      }
    });
  }

  // 加购和购买
  document
    .querySelectorAll(".product_info_buybox_btns_btn")
    .forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const type = btn.getAttribute("data-type");
        const goods_id = document.querySelector("input[name='goods_id']").value;
        const cartFormData = {
          items: [{ id: goods_id, quantity: Number(quantityInput.value) }],
        };
        btn.classList.add("is-loading");
        if (type === "add_to_cart") {
          try {
            await fetch(window.Shopify.routes.root + "cart/add.js", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(cartFormData),
            });
          } finally {
            btn.classList.remove("is-loading");
          }
        }
        if (type === "buy_it_now") {
          const buildCheckoutUrl = (items) => {
            const cartParams = items
              .map((item) => `${item.id}:${item.quantity}`)
              .join(",");

            return `/cart/${cartParams}?checkout`;
          };

          location.href = buildCheckoutUrl(cartFormData.items);
          btn.classList.remove("is-loading");
        }
      });
    });
}
// 变体切换
const product_data = JSON.parse(document.getElementById('product_info_data').textContent);
console.log(product_data)
const product = product_data.product
let currVariant = product_data.variant
const symbol = product_data.symbol
const curr_options = [...currVariant.options]
setVariantOption()
function setVariantOption() {
  document.querySelectorAll(".product_info_option_select").forEach((selector, selectorIndex) => {
    if (selectorIndex < 2) return
    const options = selector.querySelectorAll('.product_info_option_select_item');

    options.forEach(opt => {
      opt.classList.add('hidden')
      // opt.classList.remove('product_info_option_select_item_unavailable')
    });

    product.variants.forEach((variant) => {
      let matchCount = 0;

      variant.options.forEach((option, optionIndex) => {
        if (option === currVariant.options[optionIndex] && optionIndex !== selectorIndex) {
          matchCount += 1;
        }
      });

      if (matchCount === currVariant.options.length - 1) {
        const optionEl = Array.from(options).find((opt) => {
          return opt.getAttribute("data-value") === variant.options[selectorIndex];
        });

        if (optionEl) {
          optionEl.classList.remove("hidden");
          // if (!variant.available) optionEl.classList.add("product_info_option_select_item_unavailable");
        }
      }
    });
  });
};
document.querySelectorAll(".product_info_option_select_item").forEach(el => {
  el.addEventListener("click", (event) => {
    const target = event.target.closest(".product_info_option_select_item")
    if (target.classList.contains("product_info_option_select_item_select")) return
    const parent = target.closest(".product_info_option_select")
    parent.querySelector('.product_info_option_select_item_select').classList.remove('product_info_option_select_item_select')
    target.classList.add('product_info_option_select_item_select')
    curr_options[parent.getAttribute("data-index")] = target.getAttribute("data-value")
    currVariant = product.variants.find(el => areArraysEqual(curr_options, el.options))
    if (!currVariant && curr_options.length === 3) {
      currVariant = product.variants.find(
        (v) => v.option1 === curr_options[0] && v.option2 === curr_options[1]
      );

      if (currVariant) {
        curr_options[2] = currVariant.option3
        document.querySelectorAll(`.product_info_option_select[data-index="2"] .product_info_option_select_item`).forEach(el => {
          if (el.getAttribute("data-value") === currVariant.option3) {
            el.classList.add('product_info_option_select_item_select')
          } else {
            el.classList.remove('product_info_option_select_item_select')
          }
        });
      }
    }
    setVariantOption()
    updateVariantPrice()
    updateBuyBtns()
  })
})
function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
function updateVariantPrice() {
  const price = moneyWithoutTrailingZeros(currVariant.price)
  document.querySelectorAll(".product_info_price_dp").forEach(item => item.innerHTML = price)
  if (currVariant.compare_at_price && currVariant.compare_at_price > currVariant.price) {
    const compare_at_price = moneyWithoutTrailingZeros(currVariant.compare_at_price)
    document.querySelectorAll(".product_info_price_op").forEach(item => {
      item.innerHTML = compare_at_price
      item.classList.remove("hidden")
    })
  } else {
    document.querySelectorAll(".product_info_price_op").forEach(item => item.classList.add("hidden"))
  }
}
function moneyWithoutTrailingZeros(cents) {
  const amount = cents / 100;
  const formatted = amount.toFixed(2);

  const final = formatted.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

  return `${symbol}${final}`;
}
function updateBuyBtns() {
  const btns = document.querySelectorAll(".product_info_buybox_btns_btn")
  btns.forEach(item => item.toggleAttribute("disabled", !currVariant.available))
}
// swiper相关
let imgthumbSwiper, imgboxSwiper, videothumbSwiper, videoboxSwiper;
initSwiper()
function initSwiper() {
  imgthumbSwiper = new Swiper(".imgthumb_swiper", {
    // loop: true,
    spaceBetween: 8,
    slidesPerView: 4,
    navigation: {
      nextEl: ".imgthumb_swiper_box .imgthumb_swiper_next",
      prevEl: ".imgthumb_swiper_box .imgthumb_swiper_prev",
    },
    on: {
      click: function (swiper) {
        const clickedSlide = swiper.slides[swiper.clickedIndex];
        if (!clickedSlide || clickedSlide.style.display === 'none') return;

        const mediaId = clickedSlide.dataset.mediaId;

        const visibleSlides = Array.from(document.querySelectorAll('.imgmain_swiper .swiper-slide'))
          .filter(slide => slide.style.display !== 'none');

        const targetIndex = visibleSlides.findIndex(slide => slide.dataset.mediaId === mediaId);

        if (targetIndex > -1) {
          imgboxSwiper.slideTo(targetIndex);
        }
      }
    },
  });
  imgboxSwiper = new Swiper(".imgmain_swiper", {
    // loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    spaceBetween: 0,
    navigation: {
      nextEl: ".imgmain_swiper .imgmain_swiper_next",
      prevEl: ".imgmain_swiper .imgmain_swiper_prev",
    },
    on: {
      slideChange: function (swiper) {
        imgthumbSwiper.slideTo(swiper.activeIndex)
        const bundle_tabletop_img = document.querySelector(".product_info_bundle_tabletop_img")
        if (bundle_tabletop_img) {
          const slides = document.querySelectorAll('.imgmain_swiper .swiper-slide');
          let hiddenCount = 0;

          for (let i = 0; i <= swiper.activeIndex && i < slides.length; i++) {
            const style = window.getComputedStyle(slides[i]);
            if (style.display === "none") {
              hiddenCount++;
            }
          }
          swiper.slides[swiper.activeIndex + hiddenCount].hasAttribute("data-common") ? bundle_tabletop_img.style.display = "none" : bundle_tabletop_img.style.display = "block"
        }
      }
    },
    // thumbs: {
    //   swiper: imgthumbSwiper,
    // }
  });

  videothumbSwiper = new Swiper(".videothumb_swiper", {
    // loop: true,
    spaceBetween: 8,
    slidesPerView: 4,
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: ".videothumb_swiper_box .videothumb_swiper_next",
      prevEl: ".videothumb_swiper_box .videothumb_swiper_prev",
    },
    on: {
      click: function (swiper) {
        const clickedSlide = swiper.slides[swiper.clickedIndex];
        videoboxSwiper.slideTo(clickedSlide);

      }
    },
  });
  videoboxSwiper = new Swiper(".videomain_swiper", {
    // loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    observer: true,
    observeParents: true,
    spaceBetween: 0,
    navigation: {
      nextEl: ".videomain_swiper .videomain_swiper_next",
      prevEl: ".videomain_swiper .videomain_swiper_prev",
    },
    thumbs: {
      swiper: videothumbSwiper,
    }
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

    if (type === "specs") {
      const parent = btn.closest(".product_info_left_thumb_select")
      const modal = parent.querySelector(".common_modal")
      const originalParent = modal.parentElement;
      const nextSibling = modal.nextElementSibling;
      document.body.appendChild(modal);
      modal.style.display = "block";
      document.body.style.overflowY = "hidden";

      modal.querySelector(".common_modal_close").addEventListener("click", closeModal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

      function closeModal() {
        modal.style.display = "none";
        document.body.style.overflowY = "auto";

        if (nextSibling) {
          originalParent.insertBefore(modal, nextSibling);
        } else {
          originalParent.appendChild(modal);
        }
      }
      return
    }
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
        const selectedAddsonItems = document.querySelectorAll(".product_info_bundle_product.selected");
        if (selectedAddsonItems.length) {
          selectedAddsonItems.forEach((item) => {
            const id = item.getAttribute("data-variant-id");
            cartFormData.items.push({
              id: id, quantity: 1, properties: {
                'bundle_parent_id': goods_id
              }
            });
          });
        }
        const bundle_tabletop = document.querySelector("input[name='bundle_tabletop_id']")
        if (bundle_tabletop) {
          cartFormData.items.push({
            id: bundle_tabletop.value, quantity: Number(quantityInput.value), properties: {
              'bundle_parent_id': goods_id
            }
          });
        }
        btn.classList.add("is-loading");
        if (type === "add_to_cart") {

          const body = JSON.stringify({
            ...cartFormData,
            sections: this.getSectionsToRender().map((section) => section.section),
            sections_url: window.location.pathname,
          });

          fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body } })
            .then((response) => response.text())
            .then((state) => {
              const parsedState = JSON.parse(state);
              // const sectionIds = ['cart-drawer'];
              // for (const sectionId of sectionIds) {
              //   const htmlString = sections[sectionId];
              //   const html = new DOMParser().parseFromString(htmlString, 'text/html');
              //   const sourceElement = html.querySelector(`${sectionId}`);
              //   const targetElement = document.querySelector(`${sectionId}`);
              //   if (targetElement && sourceElement) {
              //     targetElement.replaceWith(sourceElement);
              //   }
              // }
              getSectionsToRender().forEach((section) => {
                const elementToReplace =
                  document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                elementToReplace.innerHTML = getSectionInnerHTML(
                  parsedState.sections[section.section],
                  section.selector
                );
              });
              document.body.classList.add('overflow-hidden');
              const theme_cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
              if (theme_cart && theme_cart.classList.contains('is-empty')) theme_cart.classList.remove('is-empty');
              setTimeout(() => {
                theme_cart.classList.add('animate', 'active');
              });
            })
            .catch((e) => {
              console.error('Error updating cart sections:', e);
            }).finally(() => {
              btn.classList.remove("is-loading");
            });
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
function getSectionsToRender() {
  return [
    {
      id: 'CartDrawer',
      section: 'cart-drawer',
      selector: '.drawer__inner',
    },
    {
      id: 'cart-icon-bubble',
      section: 'cart-icon-bubble',
      selector: '.shopify-section',
    },
  ];
}
function getSectionInnerHTML(html, selector) {
  return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
}
// 变体切换
const product_data = JSON.parse(document.getElementById('product_info_data').textContent);
const product = product_data.product
let currVariant = product_data.variant
const symbol = product_data.symbol
const curr_options = [...currVariant.options]
const bundle_tabletop_data = JSON.parse(document.getElementById('bundle_tabletop_data').textContent);
const has_tabletop = bundle_tabletop_data.has_tabletop
const bundle_tabletop = bundle_tabletop_data.product
let curr_bundle_tabletop_variant = bundle_tabletop_data.variant
const curr_bundle_tabletop_options = curr_bundle_tabletop_variant ? [...curr_bundle_tabletop_variant.options] : []

if (!has_tabletop) {
  setVariantOption()
}
updateImagesByVariantMedia()
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
    const parent_index = parent.getAttribute("data-index")
    const is_bundle_tabletop = parent.hasAttribute("data-type")
    document.querySelectorAll(".product_info_steps_contain_item_box[data-type='option'] .product_info_steps_contain_item_box_line")[parent_index].querySelector(".product_info_steps_contain_item_box_line_value").innerHTML = target.getAttribute("data-value")
    parent.querySelector('.product_info_option_select_item_select').classList.remove('product_info_option_select_item_select')
    target.classList.add('product_info_option_select_item_select')
    target.closest(".product_info_option_item").querySelector(".product_info_option_label_select").innerHTML = target.getAttribute("data-value")
    if (is_bundle_tabletop) {
      curr_bundle_tabletop_options[Number(parent.getAttribute("data-index")) - curr_options.length] = target.getAttribute("data-value")
      curr_bundle_tabletop_variant = bundle_tabletop.variants.find(el => areArraysEqual(curr_bundle_tabletop_options, el.options))
      document.querySelector("input[name='bundle_tabletop_id']").value = curr_bundle_tabletop_variant.id
    } else {
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
              document.querySelector('.product_info_option_select[data-index="2"]').closest(".product_info_option_item").querySelector(".product_info_option_label_select").innerHTML = el.getAttribute("data-value")
              document.querySelectorAll(".product_info_steps_contain_item_box[data-type='option'] .product_info_steps_contain_item_box_line")[2].querySelector(".product_info_steps_contain_item_box_line_value").innerHTML = el.getAttribute("data-value")
            } else {
              el.classList.remove('product_info_option_select_item_select')
            }
          });
        }
      }
      document.querySelector("input[name='goods_id']").value = currVariant.id
    }
    if (!has_tabletop) {
      setVariantOption()
      updateUrl()
      updateImagesByVariantMedia()
    } else {
      document.querySelector(".product_info_bundle_tabletop_img").src = curr_bundle_tabletop_variant.featured_image.src
    }
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
  const price_dp = has_tabletop ? curr_bundle_tabletop_variant.price + currVariant.price : currVariant.price
  const price = moneyWithoutTrailingZeros(price_dp)
  document.querySelectorAll(".product_info_price_dp").forEach(item => item.innerHTML = price)
  const price_op = has_tabletop ? curr_bundle_tabletop_variant.compare_at_price + currVariant.compare_at_price : currVariant.compare_at_price
  if (price_op && price_op > price_dp) {
    const compare_at_price = moneyWithoutTrailingZeros(price_op)
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

  const trimmed = formatted
    .replace(/\.0+$/, '')
    .replace(/(\.\d*[1-9])0+$/, '$1');
  const parts = trimmed.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const final = decimalPart ? `${integerPart},${decimalPart}` : integerPart;

  return `${symbol}${final}`;
}
function updateBuyBtns() {
  const btns = document.querySelectorAll(".product_info_buybox_btns_btn")
  btns.forEach(item => item.toggleAttribute("disabled", has_tabletop ? !currVariant.available || !curr_bundle_tabletop_variant.available : !currVariant.available))
}
function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", currVariant.id);
  window.history.replaceState(null, "", url.toString());
}
function updateImagesByVariantMedia() {
  const mediaId = currVariant.featured_media?.id;
  let activeIndex = 0;
  let count = 0;

  const findSlide = (domstr, isMainSwiper = false) => {
    document.querySelectorAll(domstr).forEach((slide) => {
      const slideMediaId = slide.dataset.mediaId;
      const isCommon = slide.hasAttribute('data-common');

      if (String(slideMediaId) === String(mediaId) || isCommon) {
        slide.style.display = 'block';

        if (isMainSwiper && String(slideMediaId) === String(mediaId)) {
          activeIndex = count;
        }

        count++;
      } else {
        slide.style.display = 'none';
      }
    });
  };

  findSlide('.imgmain_swiper .swiper-slide', true);
  findSlide('.imgthumb_swiper .swiper-slide');

  imgthumbSwiper.update();
  imgboxSwiper.update();
  imgboxSwiper.slideTo(activeIndex);
}

// 捆绑步骤切换
const bundle_products_data = JSON.parse(document.getElementById('bundle_products_data').textContent);
let bundleStep = 0
document.querySelectorAll(".product_info_steps_item").forEach((item, index) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("active")) return
    bundleStep = index
    document.querySelector(".product_info_steps_item.active").classList.remove("active")
    item.classList.add("active")
    switchStep()
  })
})
document.querySelectorAll(".product_info_bundle_prevnext_btn").forEach(item => {
  item.addEventListener("click", () => {
    const type = item.getAttribute("data-type")
    if ((bundleStep === 0 && type === "prev") || (bundleStep === 2 && type === "next")) return
    type === "prev" ? bundleStep-- : bundleStep++
    document.querySelectorAll(".product_info_steps_item").forEach((el, el_index) => {
      el.classList.remove("active")
      if (bundleStep === el_index) el.classList.add("active")
    })
    switchStep()
  })
})
function switchStep() {
  document.querySelectorAll(".product_info_steps_contain").forEach((el, el_index) => {
    el.classList.add("hidden")
    if (bundleStep === el_index) el.classList.remove("hidden")
  })
  const prevBtn = document.querySelector(".product_info_bundle_prevnext_btn[data-type='prev']")
  const nextBtn = document.querySelector(".product_info_bundle_prevnext_btn[data-type='next']")
  if (bundleStep === 0) {
    prevBtn.classList.remove("active")
    nextBtn.classList.add("active")
  }
  if (bundleStep === 1) {
    prevBtn.classList.add("active")
    nextBtn.classList.add("active")
  }
  if (bundleStep === 2) {
    nextBtn.classList.remove("active")
    prevBtn.classList.add("active")
  }
}
// 捆绑产品选择
document.querySelectorAll(".product_info_bundle_product").forEach(item => {
  const handleProductClick = (skipToggle = false) => {
    if (item.classList.contains("product_info_bundle_product_disabled") || (skipToggle && item.classList.contains("selected"))) return
    const total_price_el = document.querySelectorAll(".product_info_bundle_info_total")
    const price = Number(item.getAttribute("data-price"))
    const id = item.getAttribute("data-id")
    const accesories_box = document.querySelector(".product_info_steps_contain_item_box[data-type='accesories']")
    const accesories_box_title = document.querySelector(".product_info_steps_contain_item_title[data-type='accesories']")
    const title = item.querySelector(".product_info_bundle_product_title").innerHTML
    let total_price = moneyStringToCents(total_price_el[0].innerHTML)
    item.classList.toggle("selected")
    if (item.classList.contains("selected")) {
      total_price = total_price + price

      const container = document.createElement('div');
      container.className = 'product_info_steps_contain_item_box_line';
      container.dataset.id = id;

      container.innerHTML = `<span>${title}</span><span>${moneyWithoutTrailingZeros(price)}</span>`;
      accesories_box.appendChild(container);
      accesories_box.classList.remove("hidden")
      accesories_box_title.classList.remove("hidden")
    } else {
      total_price = total_price - price

      document.querySelector(`.product_info_steps_contain_item_box_line[data-id="${id}"]`).remove()
      if (accesories_box.children.length === 0) {
        accesories_box.classList.add("hidden")
        accesories_box_title.classList.add("hidden")
      }
    }
    total_price_el.forEach(el => el.innerHTML = moneyWithoutTrailingZeros(total_price))
  }
  item.addEventListener("click", () => handleProductClick())

  const product = bundle_products_data[item.getAttribute("data-id")].product
  let currVariant = bundle_products_data[item.getAttribute("data-id")].variant
  const curr_options = [...currVariant.options]
  const select_option = item.querySelectorAll(".product_info_bundle_modal .product_info_bundle_modal_select")
  const select_item = item.querySelectorAll(".product_info_bundle_modal_select_item")
  const img_contain = item.querySelector(".product_info_bundle_modal_img")
  const dp_price_contain = item.querySelector(".product_info_bundle_modal_price_dp")
  const op_price_contain = item.querySelector(".product_info_bundle_modal_price_op")
  const setVariantOption = () => {
    select_option.forEach((selector, selectorIndex) => {
      if (selectorIndex < 2) return
      const options = selector.querySelectorAll('.product_info_bundle_modal_select_item');

      options.forEach(opt => opt.classList.add('hidden'));

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

          if (optionEl && variant.available) {
            optionEl.classList.remove("hidden");
          }
        }
      });
    });
  };

  setVariantOption()

  select_item.forEach(el => {
    el.addEventListener("click", (event) => {
      event.stopPropagation()
      const target = event.target.closest(".product_info_bundle_modal_select_item")
      if (target.classList.contains("product_info_bundle_modal_select_item_select")) return
      const parent = target.closest(".product_info_bundle_modal_select")
      const index = parent.dataset.index
      // const is_card_circle = parent.hasAttribute("data-type")
      const parent_list = item.querySelectorAll(`.product_info_bundle_modal_select[data-index="${index}"]`)
      parent_list.forEach(parentEl => {
        parentEl.querySelector('.product_info_bundle_modal_select_item_select').classList.remove('product_info_bundle_modal_select_item_select')
        parentEl.querySelector(`.product_info_bundle_modal_select_item[data-value="${target.getAttribute("data-value")}"]`).classList.add('product_info_bundle_modal_select_item_select')
        const labelEl = parentEl.closest(".product_info_bundle_modal_item").querySelector(".product_info_bundle_modal_label_select")
        if (labelEl) {
          labelEl.innerHTML = target.getAttribute("data-value")
        }
      })
      curr_options[parent.getAttribute("data-index")] = target.getAttribute("data-value")
      currVariant = product.variants.find(el => areArraysEqual(curr_options, el.options) && el.available)
      if (currVariant) {
        img_contain.src = currVariant.featured_image.src
        dp_price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
        item.querySelector(".product_info_bundle_product_img img").src = currVariant.featured_image.src
        item.querySelector(".product_info_bundle_product_price").innerHTML = `+${moneyWithoutTrailingZeros(currVariant.price)}`
        item.setAttribute("data-variant-id", currVariant.id)

        if (currVariant.compare_at_price) {
          op_price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.compare_at_price)
          op_price_contain.classList.remove("hidden")
        } else {
          op_price_contain.classList.add("hidden")
        }
        setVariantOption()
      }
      if (!currVariant && curr_options.length === 3) {
        currVariant = product.variants.find(
          (v) => v.option1 === curr_options[0] && v.option2 === curr_options[1] && v.available
        );

        if (currVariant) {
          curr_options[2] = currVariant.option3
          item.querySelectorAll(`.product_info_bundle_modal_select[data-index="2"] .product_info_bundle_modal_select_item`).forEach(el => {
            if (el.getAttribute("data-value") === currVariant.option3) {
              el.classList.add('product_info_bundle_modal_select_item_select')
            } else {
              el.classList.remove('product_info_bundle_modal_select_item_select')
            }
          });
          img_contain.src = currVariant.featured_image.src
          dp_price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
          item.querySelector(".product_info_bundle_product_img img").src = currVariant.featured_image.src
          item.querySelector(".product_info_bundle_product_price").innerHTML = `+${moneyWithoutTrailingZeros(currVariant.price)}`
          item.setAttribute("data-variant-id", currVariant.id)

          if (currVariant.compare_at_price) {
            op_price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.compare_at_price)
            op_price_contain.classList.remove("hidden")
          } else {
            op_price_contain.classList.add("hidden")
          }
          setVariantOption()
        }
      }
    })
  })
  // 捆绑产品弹窗
  const viewdetail = item.querySelector(".product_info_bundle_product_viewdetail")
  const modal = item.querySelector(".common_modal")
  viewdetail.addEventListener("click", (e) => {
    e.stopPropagation()
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
  // 捆绑弹窗确定
  const confirm_btn = item.querySelector(".product_info_bundle_modal_btn")
  confirm_btn.addEventListener("click", () => {
    // item.querySelector(".product_info_bundle_product_img img").src = currVariant.featured_image.src
    // item.querySelector(".product_info_bundle_product_price").innerHTML = `+${moneyWithoutTrailingZeros(currVariant.price)}`
    // item.setAttribute("data-variant-id", currVariant.id)
    handleProductClick(true)
    modal.style.display = "none";
    document.body.style.overflowY = "auto";
  })
})
function moneyStringToCents(moneyStr) {
  let clean = moneyStr.replace(/[^\d,.-]/g, '');
  clean = clean.replace(/\./g, '');
  clean = clean.replace(',', '.');
  const amount = parseFloat(clean);

  if (isNaN(amount)) return null;

  return Math.round(amount * 100);
}

// 主图hover局部放大跟随鼠标
const container = document.querySelector('.product_info_left_contain');

container.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = container.getBoundingClientRect();
  container.querySelectorAll('img').forEach(item => {
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    item.style.transformOrigin = `${x}% ${y}%`;
  });
});
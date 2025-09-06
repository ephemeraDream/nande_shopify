const product_items = document.querySelectorAll(".recommended_products_section .recommended_products_product")
const recommended_products_data = JSON.parse(document.getElementById('recommended_products_data').textContent);

product_items.forEach(item => {
  const product = recommended_products_data[item.getAttribute("data-id")].product
  let currVariant = recommended_products_data[item.getAttribute("data-id")].variant
  const symbol = recommended_products_data[item.getAttribute("data-id")].symbol
  const curr_options = [...currVariant.options]
  // console.log(product, currVariant)
  const img_contain = item.querySelector(".recommended_products_img img")
  const price_contain = item.querySelector(".recommended_products_info_price")
  const select_option = item.querySelectorAll(".recommended_products_option_select")
  const select_item = item.querySelectorAll(".recommended_products_option_select_item")

  const setVariantOption = () => {
    select_option.forEach((selector, selectorIndex) => {
      if (selectorIndex < 2) return
      const options = selector.querySelectorAll('.recommended_products_option_select_item');

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

  const areArraysEqual = (arr1, arr2) => {
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

  const moneyWithoutTrailingZeros = (cents) => {
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

  select_item.forEach(el => {
    el.addEventListener("click", (event) => {
      event.preventDefault()
      const target = event.target
      if (target.classList.contains("recommended_products_option_select_item_select")) return
      const parent = target.closest(".recommended_products_option_select")
      parent.querySelector('.recommended_products_option_select_item_select').classList.remove('recommended_products_option_select_item_select')
      target.classList.add('recommended_products_option_select_item_select')
      curr_options[parent.getAttribute("data-index")] = target.getAttribute("data-value")
      currVariant = product.variants.find(el => areArraysEqual(curr_options, el.options) && el.available)
      if (currVariant) {
        img_contain.src = currVariant.featured_image.src
        price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
        setVariantOption()
      }
      if (!currVariant && curr_options.length === 3) {
        currVariant = product.variants.find(
          (v) => v.option1 === curr_options[0] && v.option2 === curr_options[1] && v.available
        );

        if (currVariant) {
          curr_options[2] = currVariant.option3
          item.querySelectorAll(`.recommended_products_option_select[data-index="2"] .recommended_products_option_select_item`).forEach(el => {
            if (el.getAttribute("data-value") === currVariant.option3) {
              el.classList.add('recommended_products_option_select_item_select')
            } else {
              el.classList.remove('recommended_products_option_select_item_select')
            }
          });
          img_contain.src = currVariant.featured_image.src
          price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
          setVariantOption()
        }
      }
    })
  })

  item.querySelector(".recommended_products_info_btn").addEventListener("click", (e) => {
    e.stopPropagation()
    e.preventDefault()
    const cartFormData = {
      items: [{ id: currVariant.id, quantity: 1 }],
    };

    const body = JSON.stringify({
      ...cartFormData,
      sections: getSectionsToRender().map((section) => section.section),
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
        if (parsedState.errors) {
          alert(parsedState.errors)
          return
        }
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
      });
  })

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
})
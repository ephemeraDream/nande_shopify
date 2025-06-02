const product_items = document.querySelectorAll(".bundle_simple .bundle_simple_product")
const bundle_simple_data = JSON.parse(document.getElementById('bundle_simple_data').textContent);

product_items.forEach(item => {
  const product = bundle_simple_data[item.getAttribute("data-id")].product
  let currVariant = bundle_simple_data[item.getAttribute("data-id")].variant
  const symbol = bundle_simple_data[item.getAttribute("data-id")].symbol
  const curr_options = [...currVariant.options]
  console.log(product, currVariant)
  const img_contain = item.querySelector(".bundle_simple_product_img img")
  const price_contain = item.querySelector(".bundle_simple_product_price")
  const select_option = item.querySelectorAll(".bundle_simple_option_select")
  const select_item = item.querySelectorAll(".bundle_simple_option_select_item")

  const setVariantOption = () => {
    select_option.forEach((selector, selectorIndex) => {
      if (selectorIndex < 2) return
      const options = selector.querySelectorAll('.bundle_simple_option_select_item');

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

          if (optionEl) {
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

    const final = formatted.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

    return `${symbol}${final}`;
  }

  select_item.forEach(el => {
    el.addEventListener("click", (event) => {
      const target = event.target
      if (target.classList.contains("bundle_simple_option_select_item_select")) return
      const parent = target.closest(".bundle_simple_option_select")
      parent.querySelector('.bundle_simple_option_select_item_select').classList.remove('bundle_simple_option_select_item_select')
      target.classList.add('bundle_simple_option_select_item_select')
      curr_options[parent.getAttribute("data-index")] = target.getAttribute("data-value")
      currVariant = product.variants.find(el => areArraysEqual(curr_options, el.options))
      if (currVariant) {
        img_contain.src = currVariant.featured_image.src
        price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
        setVariantOption()
      }
      if (!currVariant && curr_options.length === 3) {
        currVariant = product.variants.find(
          (v) => v.option1 === curr_options[0] && v.option2 === curr_options[1]
        );

        if (currVariant) {
          item.querySelectorAll(`.bundle_simple_option_select[data-index="2"] .bundle_simple_option_select_item`).forEach(el => {
            if (el.getAttribute("data-value") === currVariant.option3) {
              el.classList.add('bundle_simple_option_select_item_select')
            } else {
              el.classList.remove('bundle_simple_option_select_item_select')
            }
          });
          img_contain.src = currVariant.featured_image.src
          price_contain.innerHTML = moneyWithoutTrailingZeros(currVariant.price)
          setVariantOption()
        }
      }
    })
  })
})
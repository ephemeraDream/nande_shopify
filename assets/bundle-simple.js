const product_items = document.querySelectorAll(".bundle_simple .bundle_simple_product")
const bundle_simple_data = JSON.parse(document.getElementById('bundle_simple_data').textContent);

product_items.forEach(item => {
  const product = bundle_simple_data[item.getAttribute("data-id")].product
  const currVariant = bundle_simple_data[item.getAttribute("data-id")].variant
  console.log(product, currVariant)
  const img_contain = item.querySelector(".bundle_simple_product_img img")
  const price_contain = item.querySelector(".bundle_simple_product_price")
  const select_option = item.querySelectorAll(".bundle_simple_option_select")

  const setVariantOption = () => {
    item.querySelectorAll(".bundle_simple_option_select_item").forEach(select_item => {
      select_item.classList.add("hidden")
    })
    select_option.forEach((selector, selectorIndex) => {
      product.variants.forEach((variant) => {
        let matchCount = 0;

        variant.options.forEach((option, optionIndex) => {
          if (option === currVariant.options[optionIndex] && optionIndex !== selectorIndex) {
            matchCount += 1;
          }
        });

        if (matchCount === currVariant.options.length - 1) {
          const options = selector.querySelectorAll('.bundle_simple_option_select_item');
          const optionEl = Array.from(options).find((opt) => {
            return opt.value === variant.options[selectorIndex];
          });

          if (optionEl) {
            optionEl.classList.add("hidden")
          }
        }
      });
    });
  }

  setVariantOption()
})
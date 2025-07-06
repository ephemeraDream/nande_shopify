const product_items = document.querySelectorAll(".bundle_simple .bundle_simple_product")
const bundle_simple_data = JSON.parse(document.getElementById('bundle_simple_data').textContent);
const bundle_simple_box = document.querySelector(".bundle_simple .bundle_simple_box_body_list")
const totalPriceEl = document.querySelector('.bundle_simple .bundle_simple_box_body_price_item');
const add_to_cart = document.querySelector(".bundle_simple .bundle_simple_box_body_btn")

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
  const add_btn = item.querySelector(".bundle_simple_product_btn")

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

    const final = trimmed.replace('.', ',');

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

  const updateTotalPrice = () => {
    let totalCents = 0;
    bundle_simple_box.querySelectorAll('.bundle_simple_box_body_list_item').forEach(item => {
      const input = item.querySelector('.bundle_simple_box_body_list_item_input');
      const quantity = parseInt(input.value, 10);
      const price = parseInt(item.getAttribute("data-price"), 10);

      totalCents += quantity * price;
    });

    totalPriceEl.textContent = moneyWithoutTrailingZeros(totalCents);
  }

  add_btn.addEventListener("click", () => {
    const exist_item = Array.from(bundle_simple_box.querySelectorAll(".bundle_simple_box_body_list_item")).find(el => el.getAttribute("data-id") == currVariant.id)
    if (exist_item) return

    const container = document.createElement('div');
    container.className = 'bundle_simple_box_body_list_item';
    container.dataset.id = currVariant.id;
    container.dataset.price = currVariant.price;

    container.innerHTML = `
      <img
        src="${currVariant.featured_image.src}"
        alt="${product.title}"
      >
      <div class="bundle_simple_box_body_list_item_right">
        <div class="bundle_simple_box_body_list_item_right_head">
          <div class="bundle_simple_box_body_list_item_right_head_left">
            <div class="bundle_simple_box_body_list_item_product_title">${product.title}</div>
            <div class="bundle_simple_box_body_list_item_product_option">
              ${currVariant.options.join(' | ')}
            </div>
          </div>
          <div class="bundle_simple_box_body_list_item_input_box">
            <div class="bundle_simple_box_body_list_item_input_up">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="10" height="10" viewBox="0 0 10 10"><defs><clipPath id="master_svg0_308_10284"><rect x="0" y="0" width="10" height="10" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_308_10284)"><g><path d="M9.224356157722474,7.715501951751709C9.224356157722474,7.715501951751709,5.2890861577224735,2.290262951751709,5.2890861577224735,2.290262951751709C5.146246157722473,2.093834751751709,4.853836157722474,2.093834751751709,4.712086157722473,2.290262951751709C4.712086157722473,2.290262951751709,0.7757000577224732,7.715501951751709,0.7757000577224732,7.715501951751709C0.7660129377224731,7.728831951751709,0.7602098577224732,7.744581951751709,0.7589339237224731,7.761021951751709C0.7576579877224732,7.777471951751709,0.7609590977224732,7.793941951751709,0.7684713577224731,7.808611951751709C0.7759835577224732,7.823301951751709,0.7874136577224732,7.835611951751709,0.8014942577224732,7.844191951751709C0.8155747577224731,7.852771951751709,0.8317561577224731,7.857271951751709,0.8482447577224731,7.857221951751709C0.8482447577224731,7.857221951751709,1.6852991577224732,7.857221951751709,1.6852991577224732,7.857221951751709C1.7422191577224733,7.857221951751709,1.7957861577224732,7.829331951751709,1.8292761577224732,7.783581951751709C1.8292761577224732,7.783581951751709,5.000026157722473,3.4130319517517087,5.000026157722473,3.4130319517517087C5.000026157722473,3.4130319517517087,8.170776157722473,7.783581951751709,8.170776157722473,7.783581951751709C8.204276157722473,7.829331951751709,8.257836157722473,7.857221951751709,8.314746157722473,7.857221951751709C8.314746157722473,7.857221951751709,9.151806157722474,7.857221951751709,9.151806157722474,7.857221951751709C9.224356157722474,7.857221951751709,9.266776157722473,7.774631951751709,9.224356157722474,7.715501951751709C9.224356157722474,7.715501951751709,9.224356157722474,7.715501951751709,9.224356157722474,7.715501951751709Z" fill="#000000" fill-opacity="0.8500000238418579"/></g></g></svg>
            </div>
            <input type="text" class="bundle_simple_box_body_list_item_input" value="01" readonly>
            <div class="bundle_simple_box_body_list_item_input_down">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="10" height="10" viewBox="0 0 10 10"><defs><clipPath id="master_svg0_308_10285"><rect x="0" y="0" width="10" height="10" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_308_10285)"><g><path d="M9.151670330047608,2.142941951751709C9.151670330047608,2.142941951751709,8.314610330047607,2.142941951751709,8.314610330047607,2.142941951751709C8.257700330047609,2.142941951751709,8.204120330047608,2.170843851751709,8.170640330047608,2.216602751751709C8.170640330047608,2.216602751751709,4.999890330047608,6.587131951751709,4.999890330047608,6.587131951751709C4.999890330047608,6.587131951751709,1.8291203300476073,2.216602751751709,1.8291203300476073,2.216602751751709C1.7956403300476074,2.170843851751709,1.7420703300476075,2.142941951751709,1.6851513300476073,2.142941951751709C1.6851513300476073,2.142941951751709,0.8480972300476074,2.142941951751709,0.8480972300476074,2.142941951751709C0.7755527300476074,2.142941951751709,0.7331420300476075,2.225531351751709,0.7755527300476074,2.284682951751709C0.7755527300476074,2.284682951751709,4.710810330047607,7.709911951751709,4.710810330047607,7.709911951751709C4.853670330047607,7.906331951751709,5.146090330047607,7.906331951751709,5.287840330047607,7.709911951751709C5.287840330047607,7.709911951751709,9.223090330047608,2.284682951751709,9.223090330047608,2.284682951751709C9.266620330047607,2.225531351751709,9.224230330047607,2.142941951751709,9.151670330047608,2.142941951751709C9.151670330047608,2.142941951751709,9.151670330047608,2.142941951751709,9.151670330047608,2.142941951751709Z" fill="#000000" fill-opacity="0.8500000238418579"/></g></g></svg>
            </div>
          </div>
        </div>
        <div class="bundle_simple_box_body_list_item_right_footer">
          <div class="bundle_simple_box_body_list_item_product_price">${moneyWithoutTrailingZeros(currVariant.price)}</div>
          <div class="bundle_simple_box_body_list_item_btn">Remove</div>
        </div>
      </div>
    `;

    container.querySelector(".bundle_simple_box_body_list_item_input_up").addEventListener("click", () => {
      const input = container.querySelector(".bundle_simple_box_body_list_item_input");
      let value = parseInt(input.value, 10);
      if (value < 10) value++;
      input.value = value.toString().padStart(2, "0");
      updateTotalPrice()
    });

    container.querySelector(".bundle_simple_box_body_list_item_input_down").addEventListener("click", () => {
      const input = container.querySelector(".bundle_simple_box_body_list_item_input");
      let value = parseInt(input.value, 10);
      if (value > 1) value--;
      input.value = value.toString().padStart(2, "0");
      updateTotalPrice()
    });

    container.querySelector(".bundle_simple_box_body_list_item_btn").addEventListener("click", () => {
      container.remove();
      updateTotalPrice()
    });

    bundle_simple_box.appendChild(container);
    updateTotalPrice()
  })
})

add_to_cart.addEventListener("click", async () => {
  const items = [];

  bundle_simple_box.querySelectorAll(".bundle_simple_box_body_list_item").forEach(item => {
    const variantId = item.dataset.id;
    const quantity = parseInt(item.querySelector(".bundle_simple_box_body_list_item_input").value, 10);

    if (variantId && quantity > 0) {
      items.push({
        id: parseInt(variantId, 10),
        quantity: quantity
      });
    }
  });

  if (items.length === 0) {
    return;
  }

  const cartFormData = { items };
  try {
    await fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartFormData),
    });
  } finally {
  }
})
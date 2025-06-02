const product_items = document.querySelectorAll(".bundle_simple .bundle_simple_product")
const bundle_simple_data = JSON.parse(document.getElementById('bundle_simple_data').textContent);

product_items.forEach(item => {
  const product = bundle_simple_data[item.getAttribute("data-id")].product
  const variant = bundle_simple_data[item.getAttribute("data-id")].variant
  console.log(product, variant)
  const img_contain = item.querySelector(".bundle_simple_product_img img")
  const price_contain = item.querySelector(".bundle_simple_product_price")
})
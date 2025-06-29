const collection_compare_data = JSON.parse(document.getElementById('collection_compare_data').textContent);
//侧拉筛选
const show_filter = document.querySelector(".collection_compare_contain_switchfilter")
show_filter.addEventListener("click", () => {
  const filter_contain = document.querySelector(".collection_compare_contain_body_left")
  if (show_filter.getAttribute("data-type") === "open") {
    show_filter.setAttribute("data-type", "close")
    filter_contain.style.display = "none"
  } else {
    show_filter.setAttribute("data-type", "open")
    filter_contain.style.display = "flex"
  }
})
//展示方式
const show_types = document.querySelectorAll(".collection_compare_contain_showtype")
show_types.forEach(item => {
  item.addEventListener("click", () => {
    if (item.classList.contains("active")) return
    show_types.forEach(item => item.classList.remove("active"))
    item.classList.add("active")
    const type = item.getAttribute("data-type")
    if (type === "list") {
      document.querySelector(".collection_compare_contain_body_right").classList.add("collection_compare_contain_body_right_list")
    } else {
      document.querySelector(".collection_compare_contain_body_right").classList.remove("collection_compare_contain_body_right_list")
    }
  })
})
//对比选择
let select_num = 0
const select_switch = document.querySelector(".collection_compare_contain_select_switch_box")
const collection_compare_select_btn = document.querySelector(".collection_compare_select_btn")
const collection_compare_select = document.querySelector(".collection_compare_select")
select_switch.addEventListener("click", () => {
  select_switch.querySelector(".collection_compare_contain_select_switch").classList.toggle("active")
  document.querySelector(".collection_compare_contain_body_right").classList.toggle("show_select")
  collection_compare_select_btn.classList.toggle("show")
})
collection_compare_select_btn.addEventListener("click", () => {
  collection_compare_select.setAttribute("open", true)
  document.body.style.overflowY = "hidden";
})
collection_compare_select.addEventListener("click", (e) => {
  if (e.target === collection_compare_select) {
    collection_compare_select.removeAttribute("open")
    document.body.style.overflowY = "auto";
  }
});
document.querySelector(".collection_compare_select_contain_body_list_tip_close").addEventListener("click", (e) => {
  collection_compare_select.removeAttribute("open")
  document.body.style.overflowY = "auto";
});
initSelectCompare()
function initSelectCompare() {
  document.querySelectorAll(".collection_compare_product_select").forEach(item => {
    item.removeEventListener("click", onProductSelectClick);
    item.addEventListener("click", onProductSelectClick);
  })
}
function onProductSelectClick(event) {
  event.preventDefault();
  event.stopPropagation()
  if (select_num === 8) {
    alert("Sie können nur 8 Produkte vergleichen.")
    return
  }
  const collection_compare_select_num = document.querySelectorAll(".collection_compare_select_num")
  const parent = event.target.closest(".collection_compare_product")
  parent.classList.toggle("selected")
  parent.classList.contains("selected") ? select_num++ : select_num--

  const selectChangeLink = () => {
    collection_compare_select_num.forEach(el => el.innerHTML = select_num)
    const collection_compare_select_contain_body_list_tip = document.querySelector(".collection_compare_select_contain_body_list_tip")
    const collection_compare_select_contain_body_btn = document.querySelector(".collection_compare_select_contain_body_btn")
    if (select_num > 1) {
      collection_compare_select_contain_body_list_tip.style.display = "none"
      collection_compare_select_contain_body_btn.removeAttribute("disable")
    } else {
      collection_compare_select_contain_body_list_tip.style.display = "block"
      collection_compare_select_contain_body_btn.setAttribute("disable", true)
    }
  }

  selectChangeLink()
  const id = parent.getAttribute("data-id")
  const product = collection_compare_data[id].product
  const collection_compare_select_contain_body_list = document.querySelector(".collection_compare_select_contain_body_list")
  if (parent.classList.contains("selected")) {
    const container = document.createElement('div');
    container.className = 'collection_compare_select_contain_body_list_item';
    container.dataset.id = product.id;

    container.innerHTML = `
        <img
          src="${product.featured_image}"
          alt="${product.title}"
        >
        <div class="collection_compare_select_contain_body_list_item_right">
          <div class="collection_compare_select_contain_body_list_item_product_title">${product.title}</div>
          <div class="collection_compare_select_contain_body_list_item_product_price">
            ${moneyWithoutTrailingZeros(product.price, collection_compare_data[id].symbol)}
            ${product.compare_at_price ? `<div class="collection_compare_select_contain_body_list_item_product_price_op">${moneyWithoutTrailingZeros(product.compare_at_price, collection_compare_data[id].symbol)}</div>` : ""}
          </div>
          <div class="collection_compare_select_contain_body_list_item_close"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="20" height="20" viewBox="0 0 20 20"><defs><clipPath id="master_svg0_558_008093/393_24441"><rect x="0" y="0" width="20" height="20" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_558_008093/393_24441)"><g><g><g><path d="M15.440799743652343,5.441168583984375L14.558799743652344,4.559173583984375L9.999799743652343,9.115133583984374L5.440794743652344,4.559173583984375L4.558799743652344,5.441168583984375L9.114759743652343,10.000173583984374L4.558799743652344,14.559173583984375L5.440794743652344,15.441173583984375L9.999799743652343,10.885203583984374L14.558799743652344,15.441173583984375L15.440799743652343,14.559173583984375L10.884829743652343,10.000173583984374L15.440799743652343,5.441168583984375Z" fill="#7F7E75" fill-opacity="1"/></g></g></g></g></svg></div>
        </div>
      `;

    container.querySelector(".collection_compare_select_contain_body_list_item_close").addEventListener("click", (e) => {
      const item = e.target.closest(".collection_compare_select_contain_body_list_item")
      item.remove()
      parent.classList.toggle("selected")
      select_num--
      selectChangeLink()
    })

    collection_compare_select_contain_body_list.appendChild(container);
  } else {
    document.querySelectorAll(".collection_compare_select_contain_body_list_item").forEach(item => {
      const itemId = item.getAttribute("data-id")
      if (id == itemId) {
        item.remove()
        selectChangeLink()
      }
    })
  }
}
//加载更多
initLoadMore()
function initLoadMore() {
  const loadMoreButton = document.querySelector(".collection_compare_pagination_contain_btn")
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async (e) => {
      e.preventDefault();
      loadMoreButton.classList.add("is-loading")
      const response = await fetch(loadMoreButton.href);
      const tmpl = document.createElement('template');
      tmpl.innerHTML = await response.text();
      const items = document.querySelectorAll(".collection_compare_product")
      const lastItem = items[items.length - 1];
      let newResultsHtml = '';
      tmpl.content.querySelectorAll('.collection_compare_product').forEach((result) => {
        newResultsHtml += result.outerHTML;
      });
      lastItem.insertAdjacentHTML('afterend', newResultsHtml);
      const oldPagination = document.querySelector('.collection_compare_pagination');
      const newPagination = tmpl.content.querySelector('.collection_compare_pagination');
      if (newPagination.dataset.isMoreResults) {
        oldPagination.innerHTML = newPagination.innerHTML;
        initLoadMore()
      } else {
        oldPagination.remove();
      }
      loadMoreButton.classList.remove("is-loading")
      initSelectCompare()
    })
  }
}
//排序
document.querySelectorAll(".collection_compare_contain_sort_select_item").forEach(item => {
  item.addEventListener("click", () => {
    const value = item.getAttribute("value")
    document.querySelector(".collection_compare_contain_sort_label").innerHTML = item.innerHTML
    const input = document.querySelector(`input[name="sort_by"][value="${value}"]`);
    if (input) {
      input.checked = true;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  })
})

function moneyWithoutTrailingZeros(cents, symbol) {
  const amount = cents / 100;
  const formatted = amount.toFixed(2);

  const final = formatted.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

  return `${symbol}${final}`;
}

document.querySelectorAll(".collection_compare_product_saleinfo_countdown").forEach(item => {
  const endDateStr = item.getAttribute('data-end-date');
  const endDate = new Date(endDateStr);

  const updateCountdownInnerHTML = (days, hours, minutes, seconds) => {
    if (days > 0) {
      item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='day']").innerHTML = String(days).padStart(
        2,
        '0'
      );
    }
    item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='hour']").innerHTML = String(hours).padStart(
      2,
      '0'
    );
    item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='minute']").innerHTML = String(
      minutes
    ).padStart(2, '0');
    item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='second']").innerHTML = String(
      seconds
    ).padStart(2, '0');

    if (days == 0 && item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='day']")) {
      item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='day'] + span").remove();
      item.querySelector(".collection_compare_product_saleinfo_countdown_item[data-type='day']").remove();
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
})
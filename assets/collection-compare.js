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
document.querySelectorAll(".collection_compare_product_select").forEach(item => {
  item.addEventListener("click", (event) => {
    event.stopPropagation()
    const parent = e.target.closest(".collection_compare_product")
    parent.classList.toggle("selected")
  })
})
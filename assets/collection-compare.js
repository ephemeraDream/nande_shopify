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

const select_switch = document.querySelector(".collection_compare_contain_select_switch_box")
select_switch.addEventListener("click", () => {
  select_switch.querySelector(".collection_compare_contain_select_switch").classList.toggle("active")
  document.querySelector(".collection_compare_contain_body_right").classList.toggle("show_select")
})

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
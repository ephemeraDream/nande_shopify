class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.location.pathname === '/cart') {
        location.href = "/cart"
        return;
      }
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        if (window.location.pathname === '/cart') {
          location.href = "/cart"
          return;
        }
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
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

  initBtnEvents() {
    const cart_products = this.querySelectorAll('[id^="CartDrawer-Item-"]');
    cart_products.forEach(item => {
      const bundle_product_contain = item.querySelector(".cartdrawer_bundle_product");
      const bundle_btn = item.querySelector(".cartdrawer_bundle_product_head");
      if (bundle_product_contain && bundle_btn && !bundle_btn.dataset.initialized) {
        bundle_btn.addEventListener("click", () => {
          bundle_product_contain.classList.toggle("active");
        });
        bundle_btn.dataset.initialized = "true";
      }
    });

    const cartdrawer_viewdetail = document.querySelector(".cartdrawer_viewdetail")
    if (cartdrawer_viewdetail && !cartdrawer_viewdetail.dataset.initialized) {
      cartdrawer_viewdetail.addEventListener("click", () => {
        const parent = cartdrawer_viewdetail.closest(".drawer__footer")
        parent.classList.toggle("active")
      })
      cartdrawer_viewdetail.dataset.initialized = "true";
    }

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entries[0].isIntersecting) return;

        observer.unobserve(productRecommendationsSection);

        // const url = productRecommendationsSection.dataset.url;
        const url = `${window.Shopify.routes.root}recommendations/products.json?product_id=${productRecommendationsSection.dataset.id}&intent=complementary`

        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector('.cart-drawer .cart_product_recommendations');

            if (recommendations && recommendations.innerHTML.trim().length) {
              productRecommendationsSection.innerHTML = recommendations.innerHTML;

              initializeSwiper();
            }
          })
          .catch((e) => {
            console.error(e);
          });
      });
    };

    const initializeSwiper = () => {
      setTimeout(() => {
        new Swiper('.cart-drawer .cart_product_recommendations_swiper', {
          slidesPerView: 4,
          loop: true,
          spaceBetween: 2,
          navigation: {
            nextEl: '.cart-drawer .cart_product_recommendations_swiper_next',
            prevEl: '.cart-drawer .cart_product_recommendations_swiper_prev',
          },
        });
      }, 0);
    };

    const productRecommendationsSection = document.querySelector('.cart-drawer .cart_product_recommendations');
    if (productRecommendationsSection && !productRecommendationsSection.dataset.initialized) {
      const observer = new IntersectionObserver(handleIntersection, { rootMargin: '0px 0px 0px 0px' });
      observer.observe(productRecommendationsSection);
      productRecommendationsSection.dataset.initialized = "true";
    }
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);

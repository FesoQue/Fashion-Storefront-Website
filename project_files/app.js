// SELECTORS
let url = 'https://fakestoreapi.com/products';

const hamburger = document.querySelector('#open_menu');
const cart = document.querySelector('.cart_icon');
const closeBtn = document.querySelector('#close_cart');
const navList = document.querySelector('.nav_list');
const sidebar = document.querySelector('.sidebar');
const searchIcon = document.querySelector('.search_icon');
const searchModal = document.querySelector('.search_modal');
const overlay_1 = document.querySelector('.one');
const overlay_2 = document.querySelector('.two');
const cancelBtn = document.querySelector('.cancel_btn');
const productsContainer = document.querySelector('.products');
const preloader = document.querySelector('.preloader');
const reload = document.querySelector('.reload');
const reloadBtn = document.querySelector('.reload_btn');
const search = document.querySelector('.search_bar');
const searchBtn = document.querySelector('.search_btn');
const form = document.querySelector('.search_form');
const cartItemWrapper = document.querySelector('.cart_items_content');
const emptyCartMsg = document.querySelector('.empty-cart');
const itemCount = document.querySelector('.cart_count');

const getProducts = async () => {
  preloader.style.display = 'block'; // show preload when reload button is clicked
  reload.style.display = 'none'; // hide error msg when reload button is clicked
  try {
    const response = await fetch(url);
    const data = await response.json();
    reload.style.display = 'none';
    preloader.style.display = 'none';
    displayProducts(data);
    handleSearch(data);
  } catch (error) {
    preloader.style.display = 'none';
    reload.style.display = 'block';
  }
};

// if network error occured while updating data,  display error and reload!
reloadBtn.addEventListener('click', () => {
  getProducts();
});

// search through all products
const handleSearch = (data) => {
  const handleProductSearch = () => {
    const searchTerms = search.value.toLowerCase();
    let newProduct = [];
    newProduct = data.filter((product) => {
      const productName = product.title.toLowerCase();
      if (productName.includes(searchTerms)) {
        return product;
      }
      // close modal if search button is clicked
      searchModal.classList.remove('show_search_modal');
      overlay_1.classList.remove('show_overlay');
    });
    displayProducts(newProduct);
  };
  searchBtn.addEventListener('click', handleProductSearch);
  search.addEventListener('keyup', handleProductSearch);
};

// display products
const displayProducts = (products) => {
  let items = products.map((product) => {
    const { id, image, title, price, description, category, rating } = product;
    return `
        <!-- single product -->
          <div class="product" data-id=${id}>
            <div class="product_img">
              <img src=${image} alt="" width="100px" height="100px">
            </div>
            <div class="product_info">
              <p class="product_name">${title.substring(0, 35) + '...'}</p>
               <div class="price">
               <p class="price_tag">$${(price - price * 0.1).toFixed(1)}</p>
                <p class="discount">$${price.toFixed(1)}</p>
              </div>
              <div class="to_cart"><button class="add_to_cart_btn"> <i class="fas fa-plus"></i> Add to cart</button></div>
            </div>
          </div>
    `;
  });
  items = items.join(' ');
  productsContainer.innerHTML = items;
  getDomElements();
  handleRemoveItem();
};

// ADD ITEMS/PRODUCTS TO CART
const getDomElements = () => {
  const addToCartBtn = document.querySelectorAll('.add_to_cart_btn');
  let cart = [];
  for (let index = 0; index < addToCartBtn.length; index++) {
    const cartBtn = addToCartBtn[index];
    if (cart.length === 0) {
      emptyCartMsg.style.display = 'flex';
    }
    cartBtn.addEventListener('click', () => {
      if (cartBtn) {
        cartBtn.innerText = 'Added to cart';
        cartBtn.disabled = true;
      }
      cart.unshift(cartBtn); // add newest product on top of the cart
      let cartItem = cart.map((el) => {
        const product = el.parentElement.parentElement.parentElement;
        // img
        const img = product.querySelector('.product_img img').src;
        // title
        const title = product.querySelector('.product_name').innerText;
        // price
        const price = product.querySelector('.price_tag').innerText;
        price.replace('$', '');
        const priceValue = parseInt(price.replace('$', ''));
        return `
        <div class="single_cart_item">
                <div class="item_img">
                  <img src=${img} alt=${title} width="100px" height="100px">                 
                </div>
                <div class="item_content">
                  <div class="item_content_1">
                    <p>${title}</p>
                    <p class='price'>${price}</p>
                  </div>
                  <div class="item_content_2">
                    <div class="quantity">
                       <button class="qty_btn" aria-label="decrease_quantity"><i class="fas fa-minus"></i></button>
                      <input type="number" class="input_quantity" value="1" aria-label="item_quantity">
                      <button class="qty_btn" aria-label="increase_quantity"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="remove_btn">remove</button>
                  </div>
                </div>
              </div>
        `;
      });
      cartItem = cartItem.join('');
      cartItemWrapper.innerHTML = cartItem;
      emptyCartMsg.style.display = 'none';
      handleCartItemCount();
      handleRemoveItem();
      totalAmount(cartItemWrapper);
    });
  }
};
// cart item count
const handleCartItemCount = () => {
  const wrapper = document.querySelector('.cart_items_content');
  const items = wrapper.querySelectorAll('.single_cart_item');
  let count = 0;
  items.forEach((item, index) => {
    count = `${index + 1}`;
  });
  itemCount.innerText = count;
};

// REMOVE
const handleRemoveItem = () => {
  const wrapper = document.querySelector('.cart_items_content');
  const items = wrapper.querySelectorAll('.single_cart_item');
  items.forEach((item) => {
    const removeBtn = item.querySelector('.remove_btn');
    removeBtn.addEventListener('click', () => {
      handleCartItemCount();
      item.remove();
    });
  });
};

// cart total amount
const totalAmount = (item) => {
  const single_item = item.querySelectorAll('.single_cart_item');
  const totalAmount = document.querySelector('.cart_amt');
  let total = 0;
  single_item.forEach((item) => {
    const price = item.querySelector('.price').innerText;
    const priceValue = parseInt(price.replace('$', ''));
    total += priceValue;
  });
  totalAmount.innerText = `$${total}`;
};

// EVENT LISTENERS
window.addEventListener('DOMContentLoaded', () => {
  getProducts();
});

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('is-active')) {
    hamburger.classList.remove('is-active');
    navList.classList.remove('show_list');
  } else {
    hamburger.classList.add('is-active');
    navList.classList.add('show_list');
  }
});

cart.addEventListener('click', () => {
  sidebar.classList.add('show_sidebar');
  overlay_2.classList.add('show_overlay');
});
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('show_sidebar');
  overlay_2.classList.remove('show_overlay');
});

searchIcon.addEventListener('click', () => {
  searchModal.classList.add('show_search_modal');
  overlay_1.classList.add('show_overlay');
});
cancelBtn.addEventListener('click', () => {
  searchModal.classList.remove('show_search_modal');
  overlay_1.classList.remove('show_overlay');
});
overlay_1.addEventListener('click', () => {
  searchModal.classList.remove('show_search_modal');
  overlay_1.classList.remove('show_overlay');
});
overlay_2.addEventListener('click', () => {
  sidebar.classList.remove('show_sidebar');
  overlay_2.classList.remove('show_overlay');
});

// HERO SLIDESHOW
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName('my_slides');
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = 'block';
  setTimeout(showSlides, 5000); // Change image every 5 seconds
}

// ACCESSIBLE CATEGORY CARDS
const cards = document.querySelectorAll('.cards .card');
[...cards].forEach((card) => {
  card.addEventListener('click', (e) => {
    const cardElement = e.currentTarget;
    const link = cardElement.querySelector('a');
    let url = link.getAttribute('href'); // get the destination link of each card
    if (url) {
      location.href = url;
    }
  });
});

// MAKE BANNER ACCESSIBLE AND DIRECT IT TO MEN PRODUCT PAGE
const banner = document.querySelector('.banner_wrap');
banner.addEventListener('click', (e) => {
  const link = banner.nextElementSibling;
  if (link) {
    let url = link.getAttribute('href');
    location.href = url;
  }
});

// SWIPERJS
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  grabCursor: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 5000,
  },
});

let searchForm = document.querySelector(".search-form");
const shoppingBtn = document.getElementById("shopping-btn");
let shoppingCart = document.querySelector(".shopping-cart");

shoppingCart.addEventListener("click", function (event) {
  if (event.target.classList.contains("fa-trash")) {
    // Find the parent product container of the trash icon
    var productContainer = event.target.closest(".box");

    var productName = productContainer.querySelector("h3").textContent;

    removeProductFromCart(productName);

    productContainer.remove();
  }
});
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

document.querySelector("#shopping-btn").onclick = () => {
  shoppingCart.classList.toggle("active");
  searchForm.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let loginForm = document.querySelector(".login-form");

document.querySelector("#login-btn").onclick = () => {
  loginForm.classList.toggle("active");
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
};

window.onscroll = () => {
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

var addToCartButtons = document.querySelectorAll(".add-to-cart-button");

function addToCart(product) {
  var cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // Check if the product already exists in the cart
  var existingProduct = cartItems.find(function (item) {
    return item.name === product.name;
  });

  // Function to extract numeric price from a string with ₹ sign
  function extractPrice(priceString) {
    return parseFloat(priceString.replace("₹", "").replace(/,/g, ""));
  }

  if (existingProduct) {
    // Product already exists in the cart, update the quantity
    existingProduct.quantity += 1;
  } else {
    // Product doesn't exist in the cart, add it
    product.quantity = 1;
    // Extract numeric price from the product and add it
    product.price = extractPrice(product.price);
    cartItems.push(product);
  }

  // Save the updated cart items to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Display the updated cart items
  displayCartItems();

  // Recalculate and update the total price
  updateTotalPrice();
}
// Function to display cart items
function displayCartItems() {
  var cartItemsContainer = document.getElementById("cart-items-container");

  // Get cart items from localStorage
  var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Generate HTML for cart items
  var cartItemsHTML = "";
  var total = 0;

  cartItems.forEach(function (cartItem) {
    var itemHTML = `
  <div class="box">
    <i class="fa fa-trash"></i>
    <img src="${cartItem.image}" />
    <div class="content">
      <h3>${cartItem.name}</h3>
      <span class="price">${cartItem.price}</span>
      <span class="Quantity">Qty: ${cartItem.quantity}</span>
    </div>
  </div>
`;

    cartItemsHTML += itemHTML;

    total += parseFloat(cartItem.price) * cartItem.quantity;
  });

  // Display cart items
  cartItemsContainer.innerHTML = cartItemsHTML;

  // Display the total
  var totalHTML = `<div class="total">Total: Rs ${total.toFixed(2)}</div>`;
  cartItemsContainer.innerHTML += totalHTML;
}

// Add a click event listener to each "Add to Cart" button
addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    // Find the parent product container
    var productContainer = event.target.closest(".product-container");
    console.log(productContainer);

    // Extract product details from the container
    var product = {
      name: productContainer.querySelector("h2").textContent,
      price: productContainer.querySelector("#product-price").textContent,
      image: productContainer.querySelector("img").src,
    };
    console.log(product);

    // Add the product to the cart
    addToCart(product);
  });
});

// Function to remove a product from the cart
function removeProductFromCart(productName) {
  var cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // Use the filter method to remove all products with the same name
  cartItems = cartItems.filter(function (item) {
    return item.name !== productName;
  });

  // Save the updated cart items to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Display the updated cart items
  displayCartItems();
}

// Initial display of cart items
displayCartItems();

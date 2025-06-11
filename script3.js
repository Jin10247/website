// 渲染購物車內容
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");

  if (cart.length === 0) {
    cartList.innerHTML = "<p class='text-center text-muted'>購物車目前是空的</p>";
    totalPriceElement.textContent = "0";
    return;
  }

  let html = "<ul class='list-group mb-4'>";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = (item.price || 0) * (item.count || 0);
    total += itemTotal;

    html += `
      <li class='list-group-item d-flex justify-content-between align-items-center'>
        <div>
          <strong>${item.name}</strong> x ${item.count}
        </div>
        <span>${itemTotal.toLocaleString()} 元</span>
      </li>`;
  });

  html += "</ul>";

  cartList.innerHTML = html;
  totalPriceElement.textContent = total.toLocaleString();
}

// 結帳功能
function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) {
    alert("您的購物車目前是空的>v<");
    return;
  }

  if (confirm("確定要結帳嗎？")) {
    localStorage.removeItem("cart");
    alert("感謝您的購買！");
    renderCart();
  }
}

window.onload = renderCart;
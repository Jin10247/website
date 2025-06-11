const products = [
  { id: 1, name: "蕉綠", category: "食物", price: 80, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/1.jpg", text: "人就像香蕉一樣熟了會黃，還不熟的時候會蕉綠。" },
  { id: 2, name: "棗安", category: "食物", price: 200, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/2.jpg", text: "蘋果是平安，棗子是棗安。" },
  { id: 3, name: "這像畫嗎", category: "生活", price: 120, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/3.jpg", text: "你聽聽這像畫嗎?我看還行。" },
  { id: 4, name: "離譜", category: "生活", price: 60, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/4.jpg", text: "有時人生就像離譜它媽給離譜開門，離譜到家了。" },
  { id: 5, name: "煎牆", category: "動作", price: 85, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/5.jpg", text: "人吃土久了，就學會了煎牆。" },
  { id: 6, name: "雀食", category: "生活", price: 77, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/6.jpg", text: "嗯，那確實。" },
  { id: 7, name: "到底在炒什麼", category: "動作", price: 98, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/7.jpg", text: "加入蠔油、生抽、老抽，攪拌均勻，大火快炒，出鍋!" },
];

// 將分類定義為全域常數，避免重複定義
const ALL_CATEGORIES = ["食物", "生活", "動作"];

function renderProducts(filter = "") {
  const container = document.getElementById("productContainer");
  const noResult = document.getElementById("noResult");
  const searchTip = document.getElementById("searchTip");
  const keywordDisplay = document.getElementById("keywordDisplay");
  const searchInput = document.getElementById("searchInput"); // 取得搜尋輸入框元素

  // 確認所有必要的 DOM 元素都存在，如果不存在則提前返回，避免錯誤
  if (!container || !noResult || !searchTip || !keywordDisplay || !searchInput) {
    console.error("One or more required DOM elements are missing for rendering products.");
    return;
  }

  container.innerHTML = ""; // 清空現有商品

  let filteredProducts;
  const currentFilter = filter.trim(); // 清除首尾空白

  // 判斷是分類篩選還是關鍵字搜尋
  if (ALL_CATEGORIES.includes(currentFilter)) {
    // 這是來自首頁的分類連結或精確的分類搜尋
    filteredProducts = products.filter(p => p.category === currentFilter);
    // 更新搜尋輸入框為該分類名稱
    searchInput.value = currentFilter;
  } else if (currentFilter) {
    // 這是來自搜尋框的關鍵字搜尋 (名稱或分類)
    filteredProducts = products.filter(p =>
      p.name.includes(currentFilter) || p.category.includes(currentFilter)
    );
  } else {
    // 沒有篩選條件，顯示所有商品
    filteredProducts = products;
  }

  // 顯示或隱藏提示訊息
  if (filteredProducts.length === 0) {
    noResult.classList.remove("d-none"); // 顯示查無結果
    searchTip.classList.add("d-none");   // 隱藏搜尋提示
  } else {
    noResult.classList.add("d-none");    // 隱藏查無結果
    if (currentFilter) { // 如果有篩選條件 (無論是分類還是關鍵字)
      searchTip.classList.remove("d-none");
      keywordDisplay.textContent = currentFilter;
    } else { // 如果沒有篩選條件 (顯示所有商品)，隱藏搜尋提示
      searchTip.classList.add("d-none");
      keywordDisplay.textContent = "";
    }
  }

  // 渲染商品卡片
  filteredProducts.forEach(p => {
    const card = document.createElement("div");
    // 使用 col-md-4 確保在桌面版每行三個，同時 mb-4 提供垂直間距
    card.className = "col-md-4 mb-4";

    card.innerHTML = `
      <div class="product-card">
        <div class="product-id">#${p.id}</div>
        <img src="${p.image}" class="product-image" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>分類：${p.category}</p>
          <p>價格：${p.price} 元</p>
          <p class="more-text d-none">${p.text}</p>
          <div>
            <button class="btn-detail" onclick="toggleText(this)">查看詳情</button>
            <button class="btn-cart" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">加入購物車</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleText(button) {
  const productInfo = button.closest('.product-info');
  const textElement = productInfo.querySelector('.more-text');

  if (textElement) {
    textElement.classList.toggle("d-none");
    button.textContent = textElement.classList.contains("d-none")
      ? "查看詳情"
      : "隱藏內容";
  }
}

function addToCart(id, name, price) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.count++;
  } else {
    cart.push({ id, name, price, count: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} 已加入購物車！`);
}

// 清除搜尋函式
function resetSearch() {
  document.getElementById("searchInput").value = ""; // 清空搜尋欄
  renderProducts(); // 重新渲染所有商品 (不帶篩選條件)
}

// 綁定搜尋事件
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault(); // 阻止表單的預設提交行為
  const keyword = document.getElementById("searchInput").value.trim();
  renderProducts(keyword);
});

// 在頁面載入時檢查 URL 中的查詢參數，並進行初始渲染
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category'); // 獲取 category 參數的值

  if (categoryFilter) {
    // 如果有 category 參數，就根據該分類渲染商品
    renderProducts(categoryFilter);
    // 同步搜尋框的內容，讓用戶知道當前篩選了哪個分類
    document.getElementById("searchInput").value = categoryFilter; // 這行是多餘的，因為 renderProducts 已經有同步的功能
  } else {
    // 如果沒有 category 參數，就渲染所有商品
    renderProducts();
  }
});

const products = [
  { id: 1, name: "蕉綠", category: "食物", price: 80, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/1.jpg", text: "人就像香蕉一樣熟了會黃，還不熟的時候會蕉綠。" },
  { id: 2, name: "棗安", category: "食物", price: 200, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/2.jpg", text: "蘋果是平安，棗子是棗安。" },
  { id: 3, name: "這像畫嗎", category: "生活", price: 120, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/3.jpg", text: "你聽聽這像畫嗎?我看還行。" },
  { id: 4, name: "離譜", category: "生活", price: 60, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/4.jpg", text: "有時人生就像離譜它媽給離譜開門，離譜到家了。" },
  { id: 5, name: "煎牆", category: "動作", price: 85, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/5.jpg", text: "人吃土久了，就學會了煎牆。" },
    { id: 6, name: "雀食", category: "生活", price: 77, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/6.jpg", text: "嗯，那確實。" },
    { id: 7, name: "到底在炒什麼", category: "動作", price: 98, image: "https://raw.githubusercontent.com/Jin10247/image/7b6080225fe65657cffe07f32dbbbdfa8b75903d/7.jpg", text: "加入蠔油、生抽、老抽，攪拌均勻，大火快炒，出鍋!" },
];

function renderProducts(filter = "") {
  const container = document.getElementById("productContainer");
  const noResult = document.getElementById("noResult");
  const searchTip = document.getElementById("searchTip");
  const keywordDisplay = document.getElementById("keywordDisplay");

  container.innerHTML = "";

  // 篩選邏輯：如果 filter 是 category 並且明確是分類名稱，則篩選 category
  // 否則，保持原來的行為（搜尋 name 或 category）
  let filtered;
  const categories = ["食物", "生活", "動作"]; // 定義所有可能的分類名稱
  if (categories.includes(filter)) { // 如果 filter 是一個已知的分類名稱
    filtered = products.filter(p => p.category === filter);
    // 更新搜尋欄位顯示該分類名稱，讓用戶知道現在是篩選狀態
    document.getElementById("searchInput").value = filter;
  } else if (filter) { // 如果 filter 不是分類名稱，就當作一般搜尋關鍵字
    filtered = products.filter(p => p.name.includes(filter) || p.category.includes(filter));
  } else { // 沒有 filter，顯示所有商品
    filtered = products;
  }


  if (filtered.length === 0) {
    noResult.classList.remove("d-none"); // 顯示查無結果
    searchTip.classList.add("d-none");   // 隱藏搜尋提示
  } else {
    noResult.classList.add("d-none");    // 隱藏查無結果
    if (filter) { // 如果有篩選條件，顯示搜尋提示和關鍵字
      searchTip.classList.remove("d-none");
      keywordDisplay.textContent = filter;
    } else { // 如果沒有篩選條件 (顯示所有商品)，隱藏搜尋提示
      searchTip.classList.add("d-none");
      keywordDisplay.textContent = "";
    }
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4"; // 修正為 col-md-4 以便在桌機顯示三欄
                                      // 移除 g-4，mb-4 已經提供足夠間距
                                      // row-cols-1 row-cols-md-3 已經處理了響應式佈局
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

// 在頁面載入時檢查 URL 中的查詢參數
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category'); // 獲取 category 參數的值

  if (categoryFilter) {
    // 如果有 category 參數，就根據該分類渲染商品
    renderProducts(categoryFilter);
    // 同步搜尋框的內容，讓用戶知道當前篩選了哪個分類
    document.getElementById("searchInput").value = categoryFilter;
  } else {
    // 如果沒有 category 參數，就渲染所有商品
    renderProducts();
  }
});

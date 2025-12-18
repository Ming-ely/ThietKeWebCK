// Trangchu.js

// =====================
// HÀM QUẢN LÝ GIỎ HÀNG CHUNG
// =====================

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm này được gọi để cập nhật số lượng sách trên header
function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.getElementById("cartLink");
    if (cartLink) {
        cartLink.textContent = `Giỏ hàng (${totalCount})`;
    }
}


// =====================
// LOAD DỮ LIỆU SÁCH VÀ RENDER
// =====================

async function loadBooks() {
    try {
        const res = await fetch("book.json"); 
        const data = await res.json();

        // Mỗi mục hiển thị đủ 6 quyển, nếu thiếu thì bổ sung ngẫu nhiên
        renderBooks("flash-sale", getBooks(data.filter(b => b.tags && b.tags.includes("FLASH")), data, 6));
        renderBooks("featured-books", getBooks(data.filter(b => b.tags && b.tags.includes("HOT")), data, 6));
        renderBooks("suggest-books", getBooks(data.filter(b => b.sold > 2500), data, 6));
        renderBooks("monthly-best", getBooks(data.sort((a, b) => b.sold - a.sold), data, 6));

    } catch (error) {
        console.error("Không thể load dữ liệu sách:", error);
    }
}

// Hàm bổ sung sách ngẫu nhiên nếu thiếu
function getBooks(list, allBooks, count) {
    const result = [...list];
    // Lọc sách ngẫu nhiên chưa có trong list
    const extra = allBooks.filter(b => !result.some(r => r.id === b.id)); 

    while (result.length < count && extra.length > 0) {
        const randomIndex = Math.floor(Math.random() * extra.length);
        result.push(extra.splice(randomIndex, 1)[0]);
    }

    return result.slice(0, count);
}

// Hàm render sách ra HTML
function renderBooks(sectionId, books) {
    const grid = document.getElementById(`${sectionId}-grid`);
    if (!grid) return;

    grid.innerHTML = ""; // Xóa nội dung cũ

    books.forEach(book => {
        const card = `
        <div class="book-card" onclick="openDetail(${book.id})">

            <div class="book-badges">
                ${book.tags ? book.tags.map(tag =>
                    `<span class="tag-hot">${tag}</span>`
                ).join("") : ""}
            </div>

            <img src="${book.image}" class="book-img" alt="${book.title}">

            <div class="book-price">
                <span class="new-price">${book.price.toLocaleString('vi-VN')}đ</span>
            </div>

            <p class="author">${book.author}</p>
            <h3 class="title">${book.title}</h3>

            <div class="book-rating">
                ${'⭐'.repeat(book.rating)} (${book.sold} đã bán)
            </div>

            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromHome({
                id: ${book.id},
                title: '${book.title.replace(/'/g, "\\'")}',
                author: '${(book.author || "").replace(/'/g, "\\'")}',
                price: ${book.price},
                image: '${book.image}'
            })">
                <span class="icon-cart">🛒</span> Thêm vào giỏ
            </button>

        </div>
        `;
        
        grid.innerHTML += card;
    });
}


// Chuyển đến trang chi tiết
function openDetail(id) {
    window.location.href = `../Chitiet/detail.html?id=${id}`;
}

// Hàm thêm sách từ Trang Chủ
function addToCartFromHome(book) {
    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === book.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        // Backward-compatible: bổ sung author nếu trước đó cart chưa lưu
        if (!cart[existingItemIndex].author && book.author) {
            cart[existingItemIndex].author = book.author;
        }
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            author: book.author || "",
            price: book.price,
            image: book.image,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`${book.title} đã được thêm vào giỏ hàng!`);
    
    // Cập nhật số lượng trên Header ngay sau khi thêm
    updateCartCount(); 
}

// =====================
// KHỞI TẠO VÀ XỬ LÝ MENU
// =====================

document.addEventListener("DOMContentLoaded", () => {
    loadBooks(); 
    updateCartCount(); // 👈 Cập nhật số lượng giỏ hàng khi load trang

    // Logic Mega Menu
    const menuBtn = document.getElementById("menu-btn");
    const megaMenu = document.getElementById("mega-menu");
    const overlay = document.getElementById("menu-overlay");

    menuBtn.onclick = () => {
        megaMenu.classList.toggle("active");
        overlay.style.display = megaMenu.classList.contains("active") ? "block" : "none";
    };

    overlay.onclick = () => {
        megaMenu.classList.remove("active");
        overlay.style.display = "none";
    };
});
// =========================
// SEARCH FUNCTION
// =========================
let allBooks = [];
const searchInput = document.getElementById("searchInput");
const suggestBox = document.getElementById("suggestBox");

// Load data for search
fetch("book.json")
    .then(res => res.json())
    .then(data => allBooks = data);

// Khi nhập chữ
searchInput.addEventListener("keyup", function () {
    let keyword = searchInput.value.toLowerCase().trim();

    if (keyword === "") {
        suggestBox.style.display = "none";
        return;
    }

    let result = allBooks.filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    );

    showSuggest(result);
});

function showSuggest(list) {

    if (list.length === 0) {
        suggestBox.style.display = "none";
        return;
    }

    let html = "";

    list.forEach(book => {
        html += `
        <div class="suggest-item" onclick="openDetail(${book.id})">
            <img src="${book.image}">
            <div class="suggest-info">
                <b>${book.title}</b>
                <span>${book.author}</span>
            </div>
        </div>
        `;
    });

    suggestBox.innerHTML = html;
    suggestBox.style.display = "block";
}

// Ẩn gợi ý khi click ra ngoài
document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-bar")) {
        suggestBox.style.display = "none";
    }
});

// Nút tìm kiếm (enter)
document.getElementById("searchBtn").addEventListener("click", function () {
    let keyword = searchInput.value.toLowerCase().trim();
    let result = allBooks.find(book =>
        book.title.toLowerCase() === keyword
    );

    if (result) openDetail(result.id);
});
// Căn lại vị trí box gợi ý theo đúng vị trí ô input
function updateSuggestBoxPosition() {
    const input = document.getElementById("searchInput");
    const box = document.getElementById("suggestBox");

    if (!input || !box) return;

    // Lấy vị trí của input
    const rect = input.getBoundingClientRect();

    // Cập nhật vị trí tuyệt đối
    box.style.left = rect.left + "px";
    box.style.width = rect.width + "px"; // rộng đúng bằng input
}

// Cập nhật mỗi khi nhập chữ
searchInput.addEventListener("input", updateSuggestBoxPosition);

// Cập nhật khi resize màn hình
window.addEventListener("resize", updateSuggestBoxPosition);

// Cập nhật khi load trang
window.addEventListener("DOMContentLoaded", updateSuggestBoxPosition);
/* === Back to top button (auto-injected, non-breaking) === */
(function () {
  const STYLE_ID = "backToTopStyle";
  const BTN_ID = "backToTop";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .back-to-top-btn{
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        background: rgba(255,255,255,0.92);
        color: #333;
        box-shadow: 0 6px 18px rgba(0,0,0,0.18);
        font-size: 20px;
        line-height: 44px;
        text-align: center;
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: opacity .2s ease, transform .2s ease;
      }
      .back-to-top-btn.show{
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .back-to-top-btn:focus{
        outline: 2px solid rgba(0,0,0,0.3);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  function initButton() {
    if (document.getElementById(BTN_ID)) return;

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "back-to-top-btn";
    btn.setAttribute("aria-label", "Lên đầu trang");
    btn.title = "Lên đầu trang";
    btn.textContent = "↑";

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(btn);

    const toggle = function () {
      if (window.scrollY > 300) btn.classList.add("show");
      else btn.classList.remove("show");
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  function boot() {
    injectStyle();
    initButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

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
                <span class="new-price">${book.price.toLocaleString()}đ</span>
            </div>

            <p class="author">${book.author}</p>
            <h3 class="title">${book.title}</h3>
            
            <div class="book-rating">
                ${'⭐'.repeat(book.rating)} (${book.sold} đã bán)
            </div>
            
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromHome({
                id: ${book.id}, 
                title: '${book.title.replace(/'/g, "\\'")}', 
                price: ${book.price}, 
                image: '${book.image}'
            })">Thêm vào giỏ</button>

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
    } else {
        cart.push({
            id: book.id,
            title: book.title,
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
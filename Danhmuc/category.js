// =====================
// LẤY LOẠI DANH MỤC TỪ URL
// =====================
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

// =====================
// TÊN HIỂN THỊ TRÊN GIAO DIỆN
// =====================
const CATEGORY_NAMES = {
    "kinh-te": "📘 Sách Kinh Tế",
    "ky-nang": "📙 Kỹ Năng Sống",
    "phat-trien": "📗 Phát Triển Bản Thân",
    "tam-ly": "📕 Sách Tâm Lý",
    "van-hoc": "📔 Sách Văn Học",
    "thieu-nhi": "🧒 Sách Thiếu Nhi",
};

document.getElementById("category-title").textContent =
    CATEGORY_NAMES[type] || "Danh mục sách";

// =====================
// LOAD book.json
// =====================
fetch("../Trangchu/book.json")
    .then(res => res.json())
    .then(data => {
        const filtered = data.filter(book => book.category === type);

        if (filtered.length === 0) {
            document.getElementById("category-grid").innerHTML =
                "<p>Không có sách thuộc danh mục này.</p>";
            return;
        }

        renderGrid(filtered);
    })
    .catch(err => console.error("Lỗi:", err));

// =====================
// HIỂN THỊ GRID
// =====================
function renderGrid(list) {
    const grid = document.getElementById("category-grid");
    grid.innerHTML = "";

    list.forEach(book => {
        const card = `
        <div class="book-card" onclick="openDetail(${book.id})">

            <div class="book-badges">
                ${book.tags ? book.tags.map(tag =>
                    `<span class="tag-hot">${tag}</span>`
                ).join("") : ""}
            </div>

            <img src="../Trangchu/${book.image}" class="book-img" alt="${book.title}">

            <div class="book-price">
                <span class="new-price">${book.price.toLocaleString()}đ</span>
            </div>

            <p class="author">${book.author}</p>
            <h3 class="title">${book.title}</h3>

        </div>
        `;
        grid.innerHTML += card;
    });
}

// =====================
// CHI TIẾT SÁCH
// =====================
function openDetail(id) {
    window.location.href = `../Chitiet/detail.html?id=${id}`;
}

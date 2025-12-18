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
// =========================
// SEARCH – FIX CUỐI CÙNG (HEADER LOAD ĐỘNG)
// =========================
(function initCategorySearch() {

    let initialized = false;

    const observer = new MutationObserver(() => {
        if (initialized) return;

        const searchInput = document.getElementById("searchInput");
        const suggestBox = document.getElementById("suggestBox");
        const searchBtn = document.getElementById("searchBtn");

        if (!searchInput || !suggestBox) return;

        initialized = true;
        observer.disconnect();

        console.log("✅ Search initialized (category)");

        let allBooks = [];

        fetch("../Trangchu/book.json")
            .then(res => res.json())
            .then(data => allBooks = data)
            .catch(err => console.error("Lỗi load book.json:", err));

        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.toLowerCase().trim();

            if (!keyword) {
                suggestBox.style.display = "none";
                return;
            }

            const results = allBooks.filter(book =>
                book.title.toLowerCase().includes(keyword) ||
                book.author.toLowerCase().includes(keyword)
            );

            renderSuggest(results);
        });

        function renderSuggest(list) {
            if (list.length === 0) {
                suggestBox.style.display = "none";
                return;
            }

            suggestBox.innerHTML = list.map(book => `
                <div class="suggest-item" onclick="openDetail(${book.id})">
                    <img src="../Trangchu/${book.image}">
                    <div class="suggest-info">
                        <b>${book.title}</b>
                        <span>${book.author}</span>
                    </div>
                </div>
            `).join("");

            suggestBox.style.display = "block";
        }

        document.addEventListener("click", e => {
            if (!e.target.closest(".search-bar")) {
                suggestBox.style.display = "none";
            }
        });

        if (searchBtn) {
            searchBtn.addEventListener("click", () => {
                const keyword = searchInput.value.toLowerCase().trim();
                const found = allBooks.find(book =>
                    book.title.toLowerCase() === keyword
                );
                if (found) openDetail(found.id);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

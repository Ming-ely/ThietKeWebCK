// =====================
// LẤY LOẠI DANH MỤC / SEARCH TỪ URL
// =====================
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const searchKeyword = params.get("search");

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

// ===== FIX TIÊU ĐỀ =====
if (searchKeyword) {
    document.getElementById("category-title").textContent =
        `🔍 Kết quả tìm kiếm: "${searchKeyword}"`;
} else {
    document.getElementById("category-title").textContent =
        CATEGORY_NAMES[type] || "Danh mục sách";
}

// =====================
// LOAD book.json
// =====================
fetch("../Trangchu/book.json")
    .then(res => res.json())
    .then(data => {

        let filtered = [];

if (searchKeyword && searchKeyword.trim() !== "") {
    const keyword = searchKeyword.toLowerCase();

    filtered = data.filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    );
} else if (type) {
    filtered = data.filter(book => book.category === type);
}

        if (filtered.length === 0) {
            document.getElementById("category-grid").innerHTML =
                "<p>Không có sách phù hợp.</p>";
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
// SEARCH – HEADER (KHÔNG ĐỤNG CODE CŨ)
// =========================
(function initCategorySearch() {

    let initialized = false;

    const observer = new MutationObserver(() => {
        if (initialized) return;

        const searchInput = document.getElementById("searchInput");
        const suggestBox = document.getElementById("suggestBox");
        const searchBtn = document.getElementById("searchBtn");

        if (!searchInput || !suggestBox || !searchBtn) return;

        initialized = true;
        observer.disconnect();

        let allBooks = [];

        fetch("../Trangchu/book.json")
            .then(res => res.json())
            .then(data => allBooks = data);

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
                <a class="suggest-item" href="../Chitiet/detail.html?id=${book.id}">
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

        // ===== FIX NÚT TÌM KIẾM =====
        searchBtn.addEventListener("click", () => {
            const keyword = searchInput.value.trim();
            if (!keyword) return;
            window.location.href = `category.html?search=${encodeURIComponent(keyword)}`;
        });

        // ===== FIX ENTER =====
        searchInput.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                searchBtn.click();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

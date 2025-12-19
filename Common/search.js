// ==========================
// BỎ DẤU TIẾNG VIỆT
// ==========================
function removeVietnameseTones(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
}

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const suggestBox = document.getElementById("suggestBox");

    // Nếu trang nào KHÔNG có search thì bỏ qua
    if (!searchInput || !searchBtn || !suggestBox) return;

    // ==========================
    // GỢI Ý KHI GÕ
    // ==========================
    searchInput.addEventListener("input", () => {
        const keyword = removeVietnameseTones(searchInput.value.trim());

        if (!keyword) {
            suggestBox.innerHTML = "";
            suggestBox.style.display = "none";
            return;
        }

        fetch("../Trangchu/book.json")
            .then(res => res.json())
            .then(data => {
                const results = data.filter(book =>
                    removeVietnameseTones(book.title).includes(keyword) ||
                    removeVietnameseTones(book.author).includes(keyword)
                );

                suggestBox.innerHTML = "";

                if (results.length === 0) {
                    suggestBox.style.display = "none";
                    return;
                }

              results.slice(0, 6).forEach(book => {
    const div = document.createElement("div");
    div.className = "suggest-item";

    div.innerHTML = `
        <img src="../Trangchu/${book.image}" alt="${book.title}">
        <div class="suggest-info">
            <div class="suggest-title">${book.title}</div>
            <div class="suggest-author">${book.author}</div>
        </div>
    `;

    div.addEventListener("click", () => {
        window.location.href = `../Chitiet/detail.html?id=${book.id}`;
    });

    suggestBox.appendChild(div);
});


                suggestBox.style.display = "block";
            });
    });

    // ==========================
    // TÌM KIẾM (ENTER + BUTTON)
    // ==========================
    function goSearch() {
        const keyword = searchInput.value.trim();
        if (!keyword) return;

        window.location.href =
            `../Danhmuc/category.html?search=${encodeURIComponent(keyword)}`;
    }

    searchBtn.addEventListener("click", goSearch);

    searchInput.addEventListener("keydown", e => {
        if (e.key === "Enter") goSearch();
    });

});

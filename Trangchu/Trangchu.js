// Trangchu.js

async function loadBooks() {
    try {
        const res = await fetch("book.json"); // đúng tên file
        const data = await res.json();

        // Mỗi mục hiển thị đủ 6 quyển, nếu thiếu thì bổ sung ngẫu nhiên
        renderBooks("flash-sale", getBooks(data.filter(b => b.tags.includes("FLASH")), data, 6));
        renderBooks("featured-books", getBooks(data.filter(b => b.tags.includes("HOT")), data, 6));
        renderBooks("suggest-books", getBooks(data.filter(b => b.sold > 2500), data, 6));
        renderBooks("monthly-best", getBooks(data.sort((a, b) => b.sold - a.sold), data, 6));
    } catch (error) {
        console.error("Không thể load dữ liệu sách:", error);
    }
}

// Hàm bổ sung sách ngẫu nhiên nếu thiếu
function getBooks(list, allBooks, count) {
    const result = [...list];
    const extra = allBooks.filter(b => !result.includes(b));

    while (result.length < count && extra.length > 0) {
        const randomIndex = Math.floor(Math.random() * extra.length);
        result.push(extra.splice(randomIndex, 1)[0]);
    }

    return result.slice(0, count);
}

// Hàm render sách ra HTML
function renderBooks(containerId, list) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    list.forEach(book => {
        const card = `
        <div class="book-card" onclick="openDetail(${book.id})">
            <div class="book-badges">
                ${book.tags.map(tag => `<span class="tag-hot">${tag}</span>`).join(" ")}
            </div>
            <img src="${book.image}" class="book-img" />
            <div class="book-labels">
                ${book.tags.includes("TOP DEAL") ? '<span class="label top-deal">TOP DEAL</span>' : ""}
            </div>
            <div class="book-price">
                <span class="new-price">${book.price.toLocaleString()}đ</span>
            </div>
            <div class="book-info">
                <p class="author">${book.author}</p>
                <h3 class="title">${book.title}</h3>
            </div>
            <div class="book-rating">
                ${"⭐".repeat(book.rating)}
                <span class="sold">Đã bán ${book.sold}</span>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

// Chuyển sang trang chi tiết sách
function openDetail(id) {
    window.location.href = `./detail.html?id=${id}`;
}

loadBooks();

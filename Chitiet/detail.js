// detail.js

// =====================
// HÀM KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// =====================

function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const userInfo = document.getElementById("userInfo");
    const usernameSpan = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token && username) {
        // Đã đăng nhập
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        userInfo.style.display = "inline";
        usernameSpan.textContent = `👤 ${username}`;

        // Xử lý nút đăng xuất
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            alert("Đã đăng xuất thành công!");
            window.location.reload();
        });
    } else {
        // Chưa đăng nhập
        loginLink.style.display = "inline";
        registerLink.style.display = "inline";
        userInfo.style.display = "none";
    }
}

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

// Hàm Thêm vào giỏ hàng
function addToCart(book) {
    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === book.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        // Backward-compatible: bổ sung author nếu trước đó cart chưa lưu
        if (!cart[existingItemIndex].author && book.author) {
            cart[existingItemIndex].author = book.author;
        }
    } else {
        // Lấy các trường cần thiết để lưu vào giỏ hàng
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

    // Bạn có thể chuyển hướng về trang giỏ hàng sau khi thêm
    // window.location.href = "../Giohang/cart.html";
}


// Kiểm tra trạng thái đăng nhập khi trang tải
checkLoginStatus();

// =====================
// LOAD DỮ LIỆU VÀ GÁN SỰ KIỆN
// =====================

// Lấy id sách từ URL: detail.html?id=2
const params = new URLSearchParams(window.location.search);
const bookId = parseInt(params.get("id"));

fetch("../Trangchu/book.json")
  .then(res => res.json())
  .then(data => {
    const book = data.find(b => b.id === bookId);
    
    if (!book) {
      document.querySelector(".detail-right").innerHTML = "<p>Không tìm thấy sách.</p>";
      return;
    }

    // Định dạng giá tiền
    const formattedPrice = book.price.toLocaleString('vi-VN') + ' VNĐ';

    // Gán dữ liệu vào DOM
    const img = document.getElementById("book-image");
    // Đường dẫn ảnh phải là ../Trangchu/images/...
    img.src = `../Trangchu/${book.image}`; 
    img.alt = book.title;

    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = book.author;
    document.getElementById("book-price").textContent = formattedPrice;
    document.getElementById("book-rating").textContent = book.rating;
    document.getElementById("book-sold").textContent = book.sold;
    document.getElementById("book-description").textContent = book.description;
    document.getElementById("book-detail").textContent = book.detail || "Chưa có thông tin chi tiết.";

    // Nút thêm vào giỏ hàng
    document.getElementById("add-to-cart").onclick = () => {
        addToCart(book);
    };

    // Cập nhật số lượng giỏ hàng trên header
    updateCartCount();
  })
  .catch(error => {
      console.error("Lỗi khi tải chi tiết sách:", error);
      document.querySelector(".detail-right").innerHTML = "<p>Đã xảy ra lỗi khi tải dữ liệu.</p>";
  });
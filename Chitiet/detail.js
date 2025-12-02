// detail.js

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
    } else {
        // Lấy các trường cần thiết để lưu vào giỏ hàng
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

    // Bạn có thể chuyển hướng về trang giỏ hàng sau khi thêm
    // window.location.href = "../Giohang/cart.html";
}


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
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

    // Gán dữ liệu vào DOM
    const img = document.getElementById("book-image");
    img.src = book.image;
    img.alt = book.title;

    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = book.author;
    document.getElementById("book-price").textContent = book.price.toLocaleString();
    document.getElementById("book-rating").textContent = book.rating;
    document.getElementById("book-sold").textContent = book.sold;
    document.getElementById("book-description").textContent = book.description;
    document.getElementById("book-detail").textContent = book.detail || "Chưa có thông tin chi tiết.";

    // Nút thêm vào giỏ hàng
    document.getElementById("add-to-cart").onclick = () => {
        //ở chỗ này khi nhấn nút thêm vào giỏ hàng thì sẽ nhảy sang trang cart.html ở thư mục Giohang
        //mới đầu chưa có file cart.html đâu, ai làm thì tự thêm vào đê
        //có gì thì sửa ngay lên file detail.js nếu cần, hư thì thôi
      window.location.href = "../Giohang/cart.html";
    };
  })
  .catch(err => {
    console.error("Lỗi khi load dữ liệu:", err);
  });

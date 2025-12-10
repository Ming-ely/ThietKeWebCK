function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function formatCurrency(number) {
    return number.toLocaleString("vi-VN") + "đ";
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById("cartLink").textContent = `Giỏ hàng (${total})`;
}

// ===========================
// RENDER CHECKOUT
// ===========================
function renderCheckout() {
    const cart = getCart();
    const list = document.getElementById("checkout-items");
    const emptyMsg = document.getElementById("empty-message");
    const content = document.querySelector(".checkout-content");

    if (cart.length === 0) {
        emptyMsg.style.display = "block";
        content.style.display = "none";
        return;
    }

    let total = 0;

    list.innerHTML = cart.map(item => {
        const sum = item.price * item.quantity;
        total += sum;

        return `
            <div class="checkout-item">
                <img src="../Trangchu/${item.image}" alt="">
                <div>
                    <h4>${item.title}</h4>
                    <p>Tác giả: ${item.author}</p>
                    <p>Số lượng: <b>${item.quantity}</b></p>
                    <p>Giá: ${formatCurrency(sum)}</p>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("total-amount").textContent = formatCurrency(total);

    updateCartCount();
}

// ===========================
// DELIVER (GIAO HÀNG)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();

    const btn = document.getElementById("deliver-btn");

    btn.addEventListener("click", () => {
        const cart = getCart();
        const total = document.getElementById("total-amount").textContent;

        alert(`Đơn hàng gồm ${cart.length} sản phẩm với tổng tiền ${total} đã được gửi đi!`);

        localStorage.removeItem("cart"); // Xóa giỏ
        window.location.href = "../Trangchu/Trangchu.html"; // Chuyển về trang chủ
    });
});

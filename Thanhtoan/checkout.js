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

    document.getElementById("subtotal-amount").textContent = formatCurrency(total);
    updateTotalPrice();
    updateCartCount();
}

// ===========================
// TÍNH TOÁN TỔNG TIỀN
// ===========================
function updateTotalPrice() {
    const subtotal = parseInt(document.getElementById("subtotal-amount").textContent.replace(/[^\d]/g, ""));
    const voucherDiscount = parseInt(document.getElementById("voucher-discount").textContent.replace(/[^\d]/g, "")) || 0;
    const finalTotal = subtotal - voucherDiscount;

    document.getElementById("total-amount").textContent = formatCurrency(Math.max(finalTotal, 0));
}

// ===========================
// VOUCHER
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();

    // Voucher button
    const voucherBtn = document.getElementById("voucher-btn");
    const voucherInput = document.getElementById("voucher-input");

    voucherBtn.addEventListener("click", () => {
        const code = voucherInput.value.trim();

        if (!code) {
            alert("Vui lòng nhập mã voucher!");
            return;
        }

        // Giả lập: mã voucher hợp lệ (có thể thay đổi)
        const validVouchers = {
            "SAVE10": 50000,
            "SAVE20": 100000,
            "WELCOME": 30000
        };

        if (validVouchers[code]) {
            const discount = validVouchers[code];
            document.getElementById("voucher-discount").textContent = formatCurrency(discount);
            alert(`✅ Áp dụng voucher thành công! Giảm ${formatCurrency(discount)}`);
            voucherInput.disabled = true;
            voucherBtn.disabled = true;
            updateTotalPrice();
        } else {
            alert("❌ Mã voucher không hợp lệ!");
            document.getElementById("voucher-discount").textContent = "0đ";
            updateTotalPrice();
        }
    });

    // Deliver button
    const btn = document.getElementById("deliver-btn");

    btn.addEventListener("click", () => {
        const address = document.getElementById("address-input").value.trim();
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const total = document.getElementById("total-amount").textContent;

        if (!address) {
            alert("⚠️ Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        const cart = getCart();
        const paymentText = payment === "card" ? "thẻ" : "tiền mặt";

        alert(`✅ Đơn hàng gồm ${cart.length} sản phẩm\n📍 Địa chỉ: ${address}\n💳 Thanh toán: ${paymentText}\n💰 Tổng tiền: ${total}\n\nĐơn hàng đã được gửi đi!`);

        localStorage.removeItem("cart");
        window.location.href = "../Trangchu/Trangchu.html";
    });
});

// checkout.js

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function formatCurrency(number) {
    const n = typeof number === "number" && !isNaN(number) ? number : 0;
    return n.toLocaleString("vi-VN") + "đ";
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
    const cartLink = document.getElementById("cartLink");
    if (cartLink) cartLink.textContent = `Giỏ hàng (${total})`;
}

/**
 * Backward-compatible: nếu cart cũ chưa lưu author thì tự bổ sung từ book.json
 * (không đổi giao diện, chỉ tránh hiện "undefined" ở checkout)
 */
async function hydrateCartAuthors(cart) {
    if (!Array.isArray(cart) || cart.length === 0) return [];

    const needsHydrate = cart.some(item => !item.author);
    if (!needsHydrate) return cart;

    try {
        const res = await fetch("../Trangchu/book.json");
        const books = await res.json();
        const byId = new Map(books.map(b => [b.id, b]));

        let changed = false;
        const hydrated = cart.map(item => {
            if (item.author) return item;

            const book = byId.get(item.id);
            const author = (book && book.author) ? book.author : "";
            changed = true;

            return { ...item, author };
        });

        if (changed) saveCart(hydrated);
        return hydrated;

    } catch (err) {
        console.warn("Không thể bổ sung tác giả cho giỏ hàng:", err);
        // fallback: vẫn đảm bảo không có undefined
        return cart.map(item => item.author ? item : ({ ...item, author: "" }));
    }
}

// ===========================
// RENDER CHECKOUT
// ===========================
async function renderCheckout() {
    let cart = getCart();
    cart = await hydrateCartAuthors(cart);

    const list = document.getElementById("checkout-items");
    const emptyMsg = document.getElementById("empty-message");
    const content = document.querySelector(".checkout-content");

    if (!list || !emptyMsg || !content) return;

    if (cart.length === 0) {
        emptyMsg.style.display = "block";
        content.style.display = "none";
        updateCartCount();
        return;
    }

    let total = 0;

    list.innerHTML = cart.map(item => {
        const qty = item.quantity || 0;
        const sum = (item.price || 0) * qty;
        total += sum;

        const authorText = item.author || "";

        return `
            <div class="checkout-item">
                <img src="../Trangchu/${item.image}" alt="">
                <div>
                    <h4>${item.title}</h4>
                    <p>Tác giả: ${authorText}</p>
                    <p>Số lượng: <b>${qty}</b></p>
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
    const subtotalText = document.getElementById("subtotal-amount")?.textContent || "0";
    const voucherText = document.getElementById("voucher-discount")?.textContent || "0";

    const subtotal = parseInt(subtotalText.replace(/[^\d]/g, "")) || 0;
    const voucherDiscount = parseInt(voucherText.replace(/[^\d]/g, "")) || 0;

    const finalTotal = Math.max(subtotal - voucherDiscount, 0);
    document.getElementById("total-amount").textContent = formatCurrency(finalTotal);
}

// ===========================
// VOUCHER + SUBMIT ORDER
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();

    // Voucher button
    const voucherBtn = document.getElementById("voucher-btn");
    const voucherInput = document.getElementById("voucher-input");

    if (voucherBtn && voucherInput) {
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
    }

    // Deliver button
    const btn = document.getElementById("deliver-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const address = document.getElementById("address-input").value.trim();
        const payment = document.querySelector('input[name="payment"]:checked')?.value || "card";
        const total = document.getElementById("total-amount").textContent;

        if (!address) {
            alert("⚠️ Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        const cart = getCart();
        const paymentText = payment === "card" ? "thẻ" : "tiền mặt";

        alert(
            `✅ Đơn hàng gồm ${cart.length} sản phẩm\n` +
            `📍 Địa chỉ: ${address}\n` +
            `💳 Thanh toán: ${paymentText}\n` +
            `💰 Tổng tiền: ${total}\n\n` +
            `Đơn hàng đã được gửi đi!`
        );

        localStorage.removeItem("cart");
        window.location.href = "../Trangchu/Trangchu.html";
    });
});
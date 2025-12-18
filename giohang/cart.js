// ===================================
// HÀM TOÀN CỤC (Định dạng & LocalStorage)
// ===================================

/**
 * Định dạng tiền tệ: 120000 -> 120.000đ
 * @param {number} number - Số tiền cần định dạng
 */
function formatCurrency(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0đ';
    }
    // Sử dụng toLocaleString để định dạng dấu phân cách hàng nghìn
    return number.toLocaleString('vi-VN') + 'đ';
}

/**
 * Lấy danh sách giỏ hàng từ LocalStorage
 * @returns {Array} Danh sách sản phẩm trong giỏ hàng
 */
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

/**
 * Lưu danh sách giỏ hàng vào LocalStorage
 * @param {Array} cart - Danh sách sản phẩm mới
 */
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Cập nhật số lượng sản phẩm trên icon Giỏ hàng (Header)
 */
window.updateCartCount = function() {
    const cart = getCart();
    // Tính tổng số lượng sản phẩm (ví dụ: 2 quyển A + 3 quyển B = 5 sản phẩm)
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.getElementById("cartLink");
    if (cartLink) {
        cartLink.textContent = `Giỏ hàng (${totalCount})`;
    }
}

// ===================================
// LOGIC XỬ LÝ GIỎ HÀNG
// ===================================

/**
 * Tạo HTML cho từng sản phẩm trong giỏ hàng
 * @param {Object} item - Thông tin sản phẩm
 */
function createCartItemHTML(item) {
    const itemTotalPrice = item.price * item.quantity;
    
    // Lưu ý: Đường dẫn ảnh cần được điều chỉnh nếu bạn đang ở thư mục Giohang
    // Nếu ảnh nằm trong thư mục Trangchu/images/, đường dẫn phải là ../Trangchu/images/
    return `
        <div class="cart-item" data-id="${item.id}">
            <img src="../Trangchu/${item.image}" class="item-image item-image-link" alt="${item.title}">
            
            <div class="item-info">
                <h4 class="item-title">${item.title}</h4>
                <p class="item-price">Giá: ${formatCurrency(item.price)}</p>
            </div>
            
            <div class="item-quantity-control">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <input 
                    type="number" 
                    class="quantity-input" 
                    value="${item.quantity}" 
                    min="1" 
                    data-id="${item.id}"
                >
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            
            <span class="item-total-price">${formatCurrency(itemTotalPrice)}</span>
            
            <button class="remove-item-btn" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
}

/**
 * Cập nhật tổng tiền tạm tính và thành tiền
 * @param {Array} cart - Danh sách sản phẩm
 */
function updateSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotalElement = document.getElementById("subtotal-amount");
    const totalElement = document.getElementById("total-amount");

    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    // Giả định Phí vận chuyển là 0đ (Miễn phí), nên Total = Subtotal
    if (totalElement) totalElement.textContent = formatCurrency(subtotal);
}

/**
 * Hiển thị giỏ hàng lên giao diện
 */
function renderCart() {
    const cart = getCart();
    const listContainer = document.getElementById("cart-items-list");
    
    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống! Vui lòng quay lại trang chủ để mua sắm.</p>';
        updateSummary([]);
        updateCartCount();
        return;
    }

    // Map cart items to HTML strings and join them
    listContainer.innerHTML = cart.map(createCartItemHTML).join('');
    
    updateSummary(cart);
    updateCartCount();
    attachEventListeners(); // Gắn lại sự kiện sau khi render
}

/**
 * Cập nhật số lượng sản phẩm (Logic đã được sửa lỗi đồng bộ)
 * @param {number} id - ID sản phẩm
 * @param {number} action - 1 (tăng), -1 (giảm), 0 (cập nhật trực tiếp)
 * @param {number} newQuantity - Số lượng mới (chỉ dùng khi action = 0)
 */
function updateQuantity(id, action, newQuantity = 0) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        let currentQuantity = cart[itemIndex].quantity;

        if (action !== 0) {
            // Tăng/giảm: phải là số nguyên dương >= 1
            currentQuantity += action;
            if (currentQuantity < 1) currentQuantity = 1;

        } else {
            // Cập nhật trực tiếp: phải là số nguyên dương >= 1
            currentQuantity = Math.max(1, newQuantity || 1);
        }

        // Chỉ cập nhật và render lại nếu số lượng thay đổi
        if (cart[itemIndex].quantity !== currentQuantity) {
            cart[itemIndex].quantity = currentQuantity;
            saveCart(cart);
            renderCart(); // Gọi renderCart để cập nhật toàn bộ DOM và Summary
            return; 
        }
    }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {number} id - ID sản phẩm
 */
function removeItem(id) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        let cart = getCart();
        const newCart = cart.filter(item => item.id !== id);
        
        saveCart(newCart);
        renderCart(); // Render lại giỏ hàng
    }
}

/**
 * Gắn lại các sự kiện click/change cho các nút/input
 * Hàm này phải được gọi sau mỗi lần renderCart()
 */
function attachEventListeners() {
    // 1. Sự kiện tăng/giảm số lượng
    document.querySelectorAll('.increase-btn, .decrease-btn').forEach(button => {
        // Loại bỏ sự kiện cũ để tránh bị nhân đôi
        button.onclick = null; 
        
        button.onclick = (e) => {
            // Đảm bảo id là số nguyên
            const id = parseInt(e.currentTarget.dataset.id); 
            const action = e.currentTarget.classList.contains('increase-btn') ? 1 : -1;
            updateQuantity(id, action);
        };
    });

    // 2. Sự kiện nhập số lượng trực tiếp
    document.querySelectorAll('.quantity-input').forEach(input => {
        // Loại bỏ sự kiện cũ để tránh bị nhân đôi
        input.onchange = null;
        
        input.onchange = (e) => {
            const id = parseInt(e.target.dataset.id);
            // Math.max(1, ...) đảm bảo giá trị luôn >= 1
            const newQuantity = Math.max(1, parseInt(e.target.value) || 1); 
            
            e.target.value = newQuantity; // Cập nhật ngay giá trị hiển thị (phòng trường hợp người dùng nhập < 1)

            updateQuantity(id, 0, newQuantity);
        };
    });

    // 3. Sự kiện xóa sản phẩm
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        // Loại bỏ sự kiện cũ để tránh bị nhân đôi
        button.onclick = null;
        
        button.onclick = (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeItem(id);
        };
    });

    // 4. Sự kiện ĐẶT HÀNG NGAY (Checkout) - Đã sửa để chuyển trang
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.onclick = null; // Reset click
        checkoutBtn.onclick = () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert("Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm để đặt hàng.");
                return;
            }
            
            // 👉 CHUYỂN HƯỚNG SANG TRANG THANH TOÁN
            // Giả định đường dẫn là "../Thanhtoan/checkout.html"
            window.location.href = "../Thanhtoan/checkout.html";
        };
    }
}


// ===================================
// CHẠY CHỨC NĂNG KHI TRANG ĐƯỢC LOAD
// ===================================

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    // Gọi updateCartCount ngay khi load trang để hiển thị số lượng trên header
    updateCartCount(); 
});
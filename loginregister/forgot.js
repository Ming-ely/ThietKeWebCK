// forgot.js — Frontend-only OTP (demo) theo TÊN ĐĂNG NHẬP (không cần backend)

const stepEmail = document.getElementById("stepEmail");
const stepOtp = document.getElementById("stepOtp");

const usernameEl = document.getElementById("username"); // ✅ đổi từ email -> username
const otpEl = document.getElementById("otp");
const newPassEl = document.getElementById("newPassword");
const confirmPassEl = document.getElementById("confirmPassword");

const demoOtpEl = document.getElementById("demoOtp");

const btnSendOtp = document.getElementById("btnSendOtp");
const btnVerify = document.getElementById("btnVerify");
const btnBack = document.getElementById("btnBack");

// Tạo OTP 6 số
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

btnSendOtp.addEventListener("click", () => {
  const username = (usernameEl?.value || "").trim();

  if (!username) {
    alert("Vui lòng nhập tên đăng nhập!");
    return;
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 2 * 60 * 1000; // 2 phút

  // Lưu OTP demo vào localStorage
  localStorage.setItem("reset_user", username);
  localStorage.setItem("reset_otp", otp);
  localStorage.setItem("reset_otp_exp", String(expiresAt));

  // Chuyển bước
  stepEmail.style.display = "none";
  stepOtp.style.display = "block";

  // Demo: hiện OTP cho bạn test
  if (demoOtpEl) {
    demoOtpEl.style.display = "block";
    demoOtpEl.textContent = `OTP demo của bạn là: ${otp} (hết hạn sau 2 phút)`;
  }

  alert("OTP đã được tạo (demo). Vui lòng dùng OTP hiển thị trên màn hình.");
});

btnBack.addEventListener("click", () => {
  stepOtp.style.display = "none";
  stepEmail.style.display = "block";
});

btnVerify.addEventListener("click", () => {
  const otpInput = (otpEl.value || "").trim();
  const newPass = newPassEl.value || "";
  const confirmPass = confirmPassEl.value || "";

  const savedOtp = localStorage.getItem("reset_otp");
  const exp = Number(localStorage.getItem("reset_otp_exp") || "0");
  const username = localStorage.getItem("reset_user") || "";

  if (!savedOtp || !exp || !username) {
    alert("Bạn chưa yêu cầu OTP. Vui lòng nhập tên đăng nhập trước.");
    stepOtp.style.display = "none";
    stepEmail.style.display = "block";
    return;
  }

  if (Date.now() > exp) {
    alert("OTP đã hết hạn. Vui lòng yêu cầu OTP mới.");
    return;
  }

  if (!/^\d{6}$/.test(otpInput)) {
    alert("OTP phải gồm 6 chữ số.");
    return;
  }

  if (otpInput !== savedOtp) {
    alert("OTP không đúng.");
    return;
  }

  if (newPass.length < 6) {
    alert("Mật khẩu mới phải từ 6 ký tự trở lên.");
    return;
  }

  if (newPass !== confirmPass) {
    alert("Mật khẩu nhập lại không khớp.");
    return;
  }

  // ✅ Lưu mật khẩu mới theo username (demo)
  localStorage.setItem("user_password_demo_" + username, newPass);

  // Xoá OTP sau khi dùng
  localStorage.removeItem("reset_user");
  localStorage.removeItem("reset_otp");
  localStorage.removeItem("reset_otp_exp");

  alert("Đổi mật khẩu (demo) thành công! Giờ bạn có thể đăng nhập lại.");
  window.location.href = "login.html";
});

// Dữ liệu demo
const cart=[{id:1,name:"Sản phẩm A",price:120000,qty:1},{id:2,name:"Sản phẩm B",price:80000,qty:2}]
const provinces=["Hồ Chí Minh","Hà Nội","Đà Nẵng","Cần Thơ"]

function format(n){return n.toLocaleString('vi-VN')}

function renderProvinces(){let p=document.getElementById("province");p.innerHTML=provinces.map(v=>`<option>${v}</option>`).join('')}

function renderCart(){let list=document.getElementById("cart-list");let sum=document.getElementById("subtotal");let html="";let sub=0
 cart.forEach(i=>{sub+=i.price*i.qty;html+=`<div class='item'><div>${i.name} x ${i.qty}</div><div>${format(i.price*i.qty)}₫</div></div>`})
 list.innerHTML=html;sum.innerHTML=format(sub)+"₫";document.getElementById("item-count").innerText=cart.length;renderSummary()}

function renderSummary(){let sub=cart.reduce((a,b)=>a+b.price*b.qty,0);let ship=document.getElementById('shipping-service').value=="express"?30000:15000;let voucher=document.getElementById("voucher").value==="NHAPMA10"?sub*0.1:0
 document.getElementById("shipping").innerText=format(ship)+"₫"
 document.getElementById("discount").innerText="-"+format(voucher)+"₫"
 document.getElementById("grand").innerText=format(sub+ship-voucher)+"₫"}

document.getElementById("apply-voucher").onclick=()=>{let v=document.getElementById("voucher").value;if(v=="NHAPMA10"){document.getElementById("voucher-msg").innerText="Áp dụng thành công (giảm 10%)"}else{document.getElementById("voucher-msg").innerText="Mã không hợp lệ"}renderSummary()}

document.getElementById("shipping-service").onchange=renderSummary

document.getElementById("pay-btn").onclick=()=>{let pay=document.querySelector('input[name=pay]:checked').value;if(pay=="bank"){document.getElementById("qr-modal").classList.remove("hidden")}}

document.getElementById("save-btn").onclick=()=>{localStorage.setItem("checkout-draft",JSON.stringify({fullname:fullname.value,phone:phone.value,address:address.value}));alert("Đã lưu nháp")}

function closeQR(){document.getElementById("qr-modal").classList.add("hidden")}

renderProvinces();renderCart()

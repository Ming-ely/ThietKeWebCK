let index = 0;
const banners = document.querySelectorAll(".banner");

function showBanner(i) {
    banners.forEach(b => b.classList.remove("active"));
    banners[i].classList.add("active");
}

function changeBanner(step) {
    index += step;
    if (index < 0) index = banners.length - 1;
    if (index >= banners.length) index = 0;
    showBanner(index);
}

showBanner(index);

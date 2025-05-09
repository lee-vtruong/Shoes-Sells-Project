document.addEventListener('DOMContentLoaded', function () {

    const filterButtons = document.querySelectorAll('.suggested-products .filter-nav .filter-btn');
    const productItems = document.querySelectorAll('.suggested-products .product-grid .product-item');

    if (!filterButtons.length) {
        console.warn('Filter buttons not found. Check the selector ".suggested-products .filter-nav .filter-btn"');
        return;
    }
    if (!productItems.length) {
        console.warn('Product items not found. Check the selector ".suggested-products .product-grid .product-item"');
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedFilter = this.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            filterProducts(selectedFilter);
        });
    });

    function filterProducts(filter) {
        productItems.forEach(item => {
            const itemCategory = item.dataset.category?.toLowerCase();

            if (filter === 'all' || itemCategory === filter?.toLowerCase()) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        effect: 'slide',

        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Cho phép click vào chấm để chuyển slide
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');

    if (!faqItems.length) {
        console.warn('No FAQ items found. Check selector ".faq-accordion .faq-item"');
        return;
    }

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionButton || !answer) {
            console.warn('FAQ item is missing question button or answer div.', item);
            return;
        }

        questionButton.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherButton = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
                }
            });

            item.classList.toggle('active');
            const isActive = item.classList.contains('active');
            questionButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            answer.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const newsSwiper = new Swiper('.news-swiper', {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 15, // Adjust space between cards

        navigation: {
            nextEl: '.news-next',
            prevEl: '.news-prev',
        },

        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 25 // Adjust space for 3 slides
            }
        },

        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },

    });
});



// API
const http = axios.create({
    baseURL: "https://shop.cyberlearn.vn",
    timeout: 30000,
})

function layDanhSachProduct() {
    http.get("/api/Product")

        .then((res) => { console.log(res.data), renderProductCard(res.data.content) })
        .catch((err) => {
            console.log(err)
        })
}
layDanhSachProduct();
// function renderProductCard(product) {
//     const container = document.querySelector(".product-container");
//     const cardHTML = `
//         <div class="card m-2" style="width: 18rem;">
//             <a href="./detail.html?id=${id}">
//                 <img src="${image}" class="card-img-top" >
//                 <div class="card-body">

//                     <p class="card-text">Rs: <span>${product.price}$</span></p>
//                 </div>
//                 <div class="card-footer d-flex justify-content-center align-items-center">
//                     <div class="start d-flex me-3">
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                     </div>
//                     <button class="btn btn-primary">
//                         <i class="fa-solid fa-cart-shopping"></i> Buy
//                     </button>
//                 </div>
//             </a>
//         </div>
//     `;
//     container.innerHTML += cardHTML;
// }

function renderProductCard(arr) {
    let content = "";
    // Lọc 8 sản phẩm đầu nếu cần
    const arr8 = arr.slice(0, 8);
    for (let product of arr8) {
        // console.log(product); // Bỏ console.log này khi không debug
        let { id, name, price, image } = product; // Chỉ lấy các thuộc tính cần dùng
        content += `
            <div class="col">
                <div class="card">
                    <a href="./detail.html?id=${id}">
                        <img src="${image}" class="card-img-top" alt="${name}">
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">Rs: <span>${price}$</span></p>
                        </div>
                        <div class="card-footer d-flex justify-content-center align-items-center">
                            <div class="start d-flex me-3">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <button class="btn btn-primary">
                                <i class="fa-solid fa-cart-shopping"></i> Buy
                            </button>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }
    document.getElementById("product-container").innerHTML = content;
}

function layDanhSachDetail(productId) {
    http.get(`/api/Product/getbyid?id=${productId}`)
        .then((res) => {
            console.log(res.data.content);
            renderProductDetail(res.data.content);
        })
        .catch((err) => {
            console.log("Lỗi khi lấy chi tiết sản phẩm:", err);
        });
}

function renderProductDetail(product) {
    let content = `
    <div class="col detailProducts-left">
        <div class="detailProducts-left-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="slick-image mt-3">
                <div><img src="${product.image}" alt=""></div>
                <div><img src="${product.image}" alt=""></div>
                <div><img src="${product.image}" alt=""></div>
                <div><img src="${product.image}" alt=""></div>
            </div>
        </div>
    </div>
    <div class="col detailProducts-right">
        <div class="detailProducts-title">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Rs:<span>${product.price}$</span></p>
            <p>Color: Black</p>
            <button class="btn-green"></button>
            <button class="btn-blue"></button>
            <button class="btn-red"></button>

            <div class="detailProducts-like">
                <div class="like">
                    <a href="#"><i class="fa-regular fa-heart"></i>Add to wishlist</a>
                    <a href="#"><i class="fa-regular fa-circle-check"></i>View Compare</a>
                    <a href="#"><i class="fa-solid fa-share-from-square"></i>Share</a>
                </div>
                <div class="number">
                    <div class="input-group d-flex w-100">
                        <button class="btn" type="button" onclick="this.nextElementSibling.stepDown()">-</button>
                        <input type="number" class="form-control text-center flex-grow-0" min="1" value="1">
                        <button class="btn" type="button" onclick="this.previousElementSibling.stepUp()">+</button>
                    </div>
                    <div class="btn-number"><button>Add to cart</button></div>
                </div>
                <div class="btn-buy"><button>Buy It Now</button></div>
            </div>

            <div class="detailProducts-ship">
                <p><i class="fa-solid fa-truck"></i> Estimated delivery: 5-7 Days from order date.</p>
                <p><i class="fa-solid fa-envelope-open-text"></i> Free Shipping & Returns: On orders above $79</p>
            </div>

            <div class="row row-cols-4 detailProducts-pay">
                <div class="col">
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" class="img-fluid" />
                </div>
                <div class="col">
                    <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" class="img-fluid" />
                </div>
                <div class="col">
                    <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" class="img-fluid" />
                </div>
                <div class="col">
                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" width="50">
                </div>
            </div>
        </div>
    </div>
    `;
    document.getElementById("productDetail").innerHTML = content;
}


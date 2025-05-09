const http = axios.create({
    baseURL: "https://shop.cyberlearn.vn",
    timeout: 30000,
})

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // ví dụ: ?id=123
}

const productId = getProductIdFromURL();
layDanhSachDetail(productId);

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
layDanhSachDetail(productId);
function renderProductDetail(product) {
    // Lấy các thuộc tính cần dùng từ product, bao gồm cả size nếu có
    let { id, name, price, description, size, image } = product;

    // Logic để hiển thị các size
    let sizeButtonsHTML = '';
    if (size && Array.isArray(size)) {
        sizeButtonsHTML = size.map(s => `<button class="btn btn-outline-secondary size-btn">${s}</button>`).join(' ');
    }


    let content = `
        <div class="col-12 col-md-6 detailProducts-left">
            <div class="detailProducts-left-item">
                <img src="${image}" class="img-fluid" alt="${name}">
                <!-- Slick slider cho ảnh nhỏ - cần khởi tạo sau khi render -->
                <div class="slick-image mt-3">
                     <!-- Bạn có thể thêm ảnh nhỏ khác ở đây nếu có trong API -->
                    <div><img src="${image}" class="img-fluid" alt="${name} small 1"></div>
                    <div><img src="${image}" class="img-fluid" alt="${name} small 2"></div>
                    <div><img src="${image}" class="img-fluid" alt="${name} small 3"></div>
                    <!-- ... thêm ảnh nhỏ nếu có -->
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 detailProducts-right">
            <div class="detailProducts-title">
                <h3>${name}</h3>
                <p>${description}</p>
                <p>Rs:<span>${price}$</span></p>

                <!-- Hiển thị size -->
                <div class="product-sizes mb-3">
                    <p class="d-inline-block me-2 font-weight-bold">Sizes:</p>
                    ${sizeButtonsHTML}
                </div>

                <!-- Hiển thị màu - Hiện tại hardcode, cần dữ liệu từ API nếu có -->
                 <div class="product-colors mb-3">
                    <p class="d-inline-block me-2 font-weight-bold">Colors:</p>
                    <button class="btn-color btn-green"></button>
                    <button class="btn-color btn-blue"></button>
                    <button class="btn-color btn-red"></button>
                    <!-- Thêm các nút màu khác dựa trên dữ liệu sản phẩm -->
                </div>

                <div class="detailProducts-like">
                    <div class="like d-flex justify-content-between mb-3">
                        <a href="#"><i class="fa-regular fa-heart me-1"></i>Add to wishlist</a>
                        <a href="#"><i class="fa-regular fa-circle-check me-1"></i>View Compare</a>
                        <a href="#"><i class="fa-solid fa-share-from-square me-1"></i>Share</a>
                    </div>
                    <div class="number d-flex align-items-center mb-3">
                        <div class="input-group quantity-selector me-3">
                            <button class="btn btn-outline-secondary btn-minus" type="button">-</button>
                            <input type="number" class="form-control text-center quantity-input" value="1" min="1" readonly>
                            <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
                        </div>
                        <div class="btn-number flex-grow-1"><button class="w-100">Add to cart</button></div>
                    </div>
                    <div class="btn-buy"><button class="w-100">Buy It Now</button></div>
                </div>

                <div class="detailProducts-ship mt-4">
                    <p><i class="fa-solid fa-truck me-2"></i> Estimated delivery: 5-7 Days from order date.</p>
                    <p><i class="fa-solid fa-envelope-open-text me-2"></i> Free Shipping & Returns: On orders above $79</p>
                </div>

                <div class="row row-cols-4 detailProducts-pay g-3 mt-4">
                    <div class="col">
                        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" class="img-fluid" />
                    </div>
                    <div class="col">
                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" class="img-fluid" />
                    </div>
                    <div class="col">
                        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" class="img-fluid" />
                    </div>
                    <div class="col">
                         <!-- Sử dụng ảnh MoMo từ source đáng tin cậy hơn nếu có -->
                        <img src="https://www.example.com/path/to/your/momo-logo.png" alt="MoMo" class="img-fluid" width="50">
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById("productDetail").innerHTML = content;

    // Khởi tạo Slick sau khi content được thêm vào DOM
    $('.slick-image').slick({
        infinite: true,
        slidesToShow: 4, // Điều chỉnh số lượng slide hiển thị
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 768, // MD breakpoint
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
             {
                breakpoint: 576, // SM breakpoint
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

     // Thêm event listeners cho nút tăng/giảm số lượng
    const quantityInput = document.querySelector('.quantity-input');
    const btnMinus = document.querySelector('.btn-minus');
    const btnPlus = document.querySelector('.btn-plus');

    if(btnMinus && btnPlus && quantityInput) {
         btnMinus.addEventListener('click', () => {
             let currentValue = parseInt(quantityInput.value);
             if (currentValue > 1) {
                 quantityInput.value = currentValue - 1;
             }
         });

         btnPlus.addEventListener('click', () => {
             let currentValue = parseInt(quantityInput.value);
             quantityInput.value = currentValue + 1;
         });
    }
}


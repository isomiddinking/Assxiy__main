// Loader tugagandan so'ng asosiy kontentni ko'rsatish
setTimeout(function() {
    document.querySelector('.content').style.display = 'block';
}, 5000);

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Current Date
    function updateCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const now = new Date();
        const dateElements = document.querySelectorAll('.current-date');
        
        dateElements.forEach(el => {
            el.textContent = now.toLocaleDateString('uz-UZ', options);
        });
    }
    
    updateCurrentDate();
    
    // Initialize Swiper
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
    
    // Shopping Cart Functionality
    const cartCount = document.querySelector('.cart-count');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    document.body.appendChild(cartModal);
    
    // Wishlist Modal
    const wishlistModal = document.createElement('div');
    wishlistModal.className = 'wishlist-modal';
    document.body.appendChild(wishlistModal);
    
    // Wishlist count element
    const wishlistCountElement = document.querySelector('.wishlist-count');
    const mobileWishlistCount = document.querySelector('.mobile-wishlist-count');
    const mobileCartCount = document.querySelector('.mobile-cart-count');
    
    // Cart HTML structure
    cartModal.innerHTML = `
        <div class="cart-header">
            <h3>Savat (<span class="cart-items-count">0</span>)</h3>
            <button class="close-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Jami:</span>
                <span class="total-price">0 so'm</span>
            </div>
            <button class="checkout-btn">Buyurtma berish</button>
        </div>
    `;
    
    // Wishlist HTML structure
    wishlistModal.innerHTML = `
        <div class="wishlist-header">
            <h3>Istaklar ro'yxati (<span class="wishlist-items-count">0</span>)</h3>
            <button class="close-wishlist"><i class="fas fa-times"></i></button>
        </div>
        <div class="wishlist-items"></div>
    `;
    
    const closeCartBtn = cartModal.querySelector('.close-cart');
    const cartItemsContainer = cartModal.querySelector('.cart-items');
    const totalPriceElement = cartModal.querySelector('.total-price');
    const cartItemsCountElement = cartModal.querySelector('.cart-items-count');
    
    const closeWishlistBtn = wishlistModal.querySelector('.close-wishlist');
    const wishlistItemsContainer = wishlistModal.querySelector('.wishlist-items');
    const wishlistItemsCountElement = wishlistModal.querySelector('.wishlist-items-count');
    
    // Toggle cart modal
    cartWrapper.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Mobile menyudagi karzina tugmasi
    document.querySelector('.mobile-menu-action.cart-action').addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        cartModal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Mobile menyudagi istaklar tugmasi
    document.querySelector('.mobile-menu-action.wishlist-action').addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        wishlistModal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateWishlist();
    });
    
    // Toggle wishlist modal
    document.querySelector('.header-action:nth-child(4)').addEventListener('click', function(e) {
        e.preventDefault();
        wishlistModal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateWishlist();
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    closeWishlistBtn.addEventListener('click', function() {
        wishlistModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', function() {
        if (cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (wishlistModal.classList.contains('active')) {
            wishlistModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Cart functionality with LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Wishlist functionality with LocalStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Initialize wishlist count on page load
    wishlistCountElement.textContent = wishlist.length;
    mobileWishlistCount.textContent = wishlist.length;
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Initialize wishlist icons on page load
    function initializeWishlistIcons() {
        document.querySelectorAll('.img-part i, .iteam__title i, .fa-heart').forEach(icon => {
            const productCard = icon.closest('.card, .card_iteam');
            if (!productCard) return;
            
            const title = productCard.querySelector('.about-product p, .product__title h3')?.textContent.trim();
            
            if (wishlist.includes(title)) {
                icon.classList.add('fas');
                icon.classList.remove('far');
                icon.style.color = 'red';
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
                icon.style.color = '#ccc';
            }
        });
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        mobileCartCount.textContent = totalItems;
        cartItemsCountElement.textContent = totalItems;
    }
    
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function saveWishlistToLocalStorage() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        wishlistCountElement.textContent = wishlist.length;
        mobileWishlistCount.textContent = wishlist.length;
    }
    
    function updateCart() {
        // Update cart items display
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Savat boʻsh</p>';
            totalPriceElement.textContent = '0 so\'m';
            cartItemsCountElement.textContent = '0';
            saveCartToLocalStorage();
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const itemPrice = parseFloat(item.price.replace(/\s/g, '')) * item.quantity;
            totalPrice += itemPrice;
            
            itemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${(itemPrice).toLocaleString('uz-UZ')} so'm</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                        <div class="remove-item" data-index="${index}">O'chirish</div>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        totalPriceElement.textContent = `${totalPrice.toLocaleString('uz-UZ')} so'm`;
        saveCartToLocalStorage();
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
                showNotification('Mahsulot savatdan o\'chirildi', 'fas fa-trash-alt', '#e53935');
            });
        });
    }
    
    function updateWishlist() {
        wishlistItemsContainer.innerHTML = '';
        wishlistItemsCountElement.textContent = wishlist.length;
        wishlistCountElement.textContent = wishlist.length;
        mobileWishlistCount.textContent = wishlist.length;
        
        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Istaklar ro\'yxati bo\'sh</p>';
            return;
        }
        
        // Find all products in the page that are in wishlist
        document.querySelectorAll('.card, .card_iteam').forEach(card => {
            const title = card.querySelector('.about-product p, .product__title h3')?.textContent.trim();
            
            if (wishlist.includes(title)) {
                const image = card.querySelector('.img-part img, .iteam__title img')?.src;
                const price = card.querySelector('.price b, .new__price')?.textContent.trim();
                
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                
                wishlistItem.innerHTML = `
                    <div class="wishlist-item-img">
                        <img src="${image}" alt="${title}">
                    </div>
                    <div class="wishlist-item-details">
                        <div class="wishlist-item-title">${title}</div>
                        <div class="wishlist-item-price">${price}</div>
                        <div class="wishlist-item-actions">
                            <button class="add-to-cart-from-wishlist">Savatga qo'shish</button>
                            <button class="remove-from-wishlist" data-title="${title}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                wishlistItemsContainer.appendChild(wishlistItem);
            }
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
            btn.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                wishlist = wishlist.filter(item => item !== title);
                saveWishlistToLocalStorage();
                updateWishlist();
                initializeWishlistIcons();
                showNotification('Mahsulot istaklar ro\'yxatidan o\'chirildi', 'fas fa-heart', 'red');
            });
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.wishlist-item');
                const title = item.querySelector('.wishlist-item-title').textContent.trim();
                const price = item.querySelector('.wishlist-item-price').textContent.trim();
                const image = item.querySelector('.wishlist-item-img img').src;
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.title === title);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        title,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                updateCart();
                showNotification('Mahsulot savatga qo\'shildi', 'fas fa-check-circle');
            });
        });
    }
    
    // Initial cart update
    updateCart();
    updateWishlist();
    initializeWishlistIcons();
    
    // Add to cart functionality
    document.querySelectorAll('.buy i, .carzina').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card, .card_iteam');
            if (!card) return;
            
            const title = card.querySelector('.about-product p, .product__title h3').textContent.trim();
            const price = card.querySelector('.price b, .new__price').textContent.trim();
            const image = card.querySelector('.img-part img, .iteam__title img').src;
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.title === title);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    title,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification('Mahsulot savatga qo\'shildi', 'fas fa-check-circle');
        });
    });
    
    // Checkout button
    const checkoutBtn = cartModal.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        alert('Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
        cart = [];
        updateCart();
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Wishlist functionality
    document.querySelectorAll('.img-part i, .iteam__title i, .fa-heart').forEach(icon => {
        icon.addEventListener('click', function() {
            const productCard = this.closest('.card, .card_iteam');
            if (!productCard) return;
            
            const title = productCard.querySelector('.about-product p, .product__title h3').textContent.trim();
            
            if (this.classList.contains('far')) {
                // Add to wishlist
                this.classList.remove('far');
                this.classList.add('fas');
                this.style.color = 'red';
                
                if (!wishlist.includes(title)) {
                    wishlist.push(title);
                    saveWishlistToLocalStorage();
                    updateWishlist();
                }
                
                showNotification('Mahsulot istaklar ro\'yxatiga qo\'shildi', 'fas fa-heart', 'red');
            } else {
                // Remove from wishlist
                this.classList.remove('fas');
                this.classList.add('far');
                this.style.color = '#ccc';
                
                wishlist = wishlist.filter(item => item !== title);
                saveWishlistToLocalStorage();
                updateWishlist();
            }
        });
    });
    
    // Notification function
    function showNotification(message, iconClass, iconColor = '') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        if (iconColor) icon.style.color = iconColor;
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
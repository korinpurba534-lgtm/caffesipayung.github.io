document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = []; // Array untuk menyimpan item di keranjang

    // Fungsi untuk menambahkan item ke keranjang
    function addItemToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }

        updateCart();
    }

    // Fungsi untuk menghapus item dari keranjang
    function removeItemFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    }

    // Fungsi untuk mengubah jumlah item di keranjang
    function changeQuantity(itemId, quantity) {
        const cartItem = cart.find(item => item.id === itemId);
        if (cartItem) {
            cartItem.quantity = quantity;
            if (cartItem.quantity <= 0) {
                removeItemFromCart(itemId);
            }
            updateCart();
        }
    }

    // Fungsi untuk mengupdate tampilan keranjang
    function updateCart() {
        cartItemsList.innerHTML = ''; // Kosongkan tampilan keranjang

        let total = 0;
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-quantity">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <span>Rp ${ (item.price * item.quantity).toLocaleString('id-ID') }</span>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        cartTotalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Event listener untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.dataset.id;
            const itemName = menuItem.dataset.name;
            const itemPrice = parseInt(menuItem.dataset.price);

            const item = {
                id: itemId,
                name: itemName,
                price: itemPrice
            };

            addItemToCart(item);
        });
    });

    // Event listener untuk tombol "Kurangi" dan "Tambah" di keranjang
    cartItemsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('decrease')) {
            const itemId = event.target.dataset.id;
            const cartItem = cart.find(item => item.id === itemId);
            if (cartItem) {
                changeQuantity(itemId, cartItem.quantity - 1);
            }
        } else if (event.target.classList.contains('increase')) {
            const itemId = event.target.dataset.id;
            const cartItem = cart.find(item => item.id === itemId);
             if (cartItem) {
                changeQuantity(itemId, cartItem.quantity + 1);
            }
        }
    });

    // Event listener untuk tombol "Checkout"
    checkoutButton.addEventListener('click', function() {
        const nama = document.getElementById('nama').value;
        const telepon = document.getElementById('telepon').value;
        const alamat = document.getElementById('alamat').value;

        if (!nama || !telepon || !alamat) {
            alert('Mohon lengkapi semua informasi pengiriman (Nama, Telepon, Alamat).');
            return;
        }

        if (cart.length === 0) {
            alert('Keranjang belanja Anda kosong.');
            return;
        }

        let orderDetails = 'Pesanan Anda:\n\n';
        cart.forEach(item => {
            orderDetails += `${item.name}: ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')} = Rp ${(item.quantity * item.price).toLocaleString('id-ID')}\n`;
        });

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        orderDetails += `\nTotal Keseluruhan: Rp ${total.toLocaleString('id-ID')}\n\n`;
        orderDetails += `Informasi Pengiriman:\n`;
        orderDetails += `Nama: ${nama}\n`;
        orderDetails += `Telepon: ${telepon}\n`;
        orderDetails += `Alamat: ${alamat}\n\n`;
        orderDetails += `Terima kasih telah memesan di Caffe Sipayung! Pesanan Anda akan segera diproses.`;

        alert(orderDetails);

        // Reset keranjang setelah checkout (opsional)
        cart = [];
        updateCart();
    });
});


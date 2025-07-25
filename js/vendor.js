// Function to display products in Vendor Dashboard
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear list

    products.forEach(doc => {
        const data = doc.data();
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <h4>${data.name}</h4>
            <p>Price: ₹${data.price}</p>
            <button class="orderBtn" data-id="${doc.id}">Order Now</button>
        `;
        productList.appendChild(productDiv);
    });

    // Add event listeners for all "Order Now" buttons
    const orderButtons = document.querySelectorAll('.orderBtn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            placeOrder(productId);
        });
    });
}

// Function to place order in Firestore
function placeOrder(productId) {
    db.collection('orders').add({
        productId: productId,
        status: 'Pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Order placed successfully!');
    })
    .catch(error => {
        console.error('Error placing order: ', error);
    });
}

// Fetch all products from Firestore on load
db.collection('products').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    displayProducts(snapshot.docs);
});

// Search functionality
document.getElementById('searchBar').addEventListener('input', function() {
    const searchText = this.value.toLowerCase();
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
        const productName = item.querySelector('h4').textContent.toLowerCase();
        if (productName.includes(searchText)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

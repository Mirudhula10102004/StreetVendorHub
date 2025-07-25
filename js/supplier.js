// Add Product Form Submission
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload

    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);

    if (productName && productPrice) {
        db.collection('products').add({
            name: productName,
            price: productPrice,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('Product added successfully!');
            document.getElementById('addProductForm').reset();
        })
        .catch(error => {
            console.error('Error adding product: ', error);
        });
    } else {
        alert('Please fill out all fields.');
    }
});

// Listen for new orders and display them live
db.collection('orders').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    const ordersDiv = document.getElementById('receivedOrders');
    ordersDiv.innerHTML = ''; // Clear existing orders

    snapshot.forEach(doc => {
        const orderData = doc.data();
        // Get product details from productId
        db.collection('products').doc(orderData.productId).get()
            .then(productDoc => {
                if (productDoc.exists) {
                    const productData = productDoc.data();
                    const orderDiv = document.createElement('div');
                    orderDiv.innerHTML = `
                        <p>Order for: <strong>${productData.name}</strong> | Status: ${orderData.status}</p>
                    `;
                    ordersDiv.appendChild(orderDiv);
                }
            });
    });
});

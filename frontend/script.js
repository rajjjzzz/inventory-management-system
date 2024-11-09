// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inventory-form');
    const itemIdInput = document.getElementById('item-id');
    const nameInput = document.getElementById('name');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const inventoryList = document.getElementById('inventory-items');
    const resetFormButton = document.getElementById('reset-form');

    // Fetch and display inventory items
    const fetchInventoryItems = async () => {
        const response = await fetch('http://localhost:5000/api/inventory');
        const items = await response.json();
        inventoryList.innerHTML = ''; // Clear the list before rendering

        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - Quantity: ${item.quantity}, Price: $${item.price}
                <button onclick="editItem('${item._id}')">Edit</button>
                <button onclick="deleteItem('${item._id}')">Delete</button>
            `;
            inventoryList.appendChild(li);
        });
    };

    // Add or Update an inventory item
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const id = itemIdInput.value;
        const name = nameInput.value;
        const quantity = parseInt(quantityInput.value, 10);
        const price = parseFloat(priceInput.value);

        const url = id ? `http://localhost:5000/api/inventory/${id}` : 'http://localhost:5000/api/inventory';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, quantity, price }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Item saved successfully');
            form.reset();
            itemIdInput.value = '';
            resetFormButton.style.display = 'none';
            fetchInventoryItems();
        } else {
            alert('Error: ' + result.error);
        }
    };

    // Edit an inventory item (populate form with existing data)
    window.editItem = (id) => {
        fetch(`http://localhost:5000/api/inventory/${id}`)
            .then(response => response.json())
            .then(item => {
                itemIdInput.value = item._id;
                nameInput.value = item.name;
                quantityInput.value = item.quantity;
                priceInput.value = item.price;
                resetFormButton.style.display = 'inline-block';
            });
    };

    // Delete an inventory item
    window.deleteItem = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Item deleted successfully');
                fetchInventoryItems();  // Refresh the list after deletion
            } else {
                const result = await response.json();
                alert('Error: ' + result.error);
            }
        }
    };

    // Reset form
    resetFormButton.addEventListener('click', () => {
        form.reset();
        itemIdInput.value = '';
        resetFormButton.style.display = 'none';
    });

    form.addEventListener('submit', handleFormSubmit);

    // Fetch inventory items when the page loads
    fetchInventoryItems();
});

// Sample data - в реальном проекте это будет загружаться из Excel файла
const productsData = [
    {
        id: 1,
        brand: "Apple",
        category: "iPhone",
        model: "iPhone 15 Pro Max",
        price: 119990,
        color: "Титан",
        storage: "256 ГБ"
    },
    {
        id: 2,
        brand: "Apple",
        category: "iPhone",
        model: "iPhone 15 Pro",
        price: 99990,
        color: "Титан",
        storage: "128 ГБ"
    },
    {
        id: 3,
        brand: "Apple",
        category: "iPhone",
        model: "iPhone 15",
        price: 79990,
        color: "Синий",
        storage: "128 ГБ"
    },
    {
        id: 4,
        brand: "Apple",
        category: "iPhone",
        model: "iPhone 14 Pro",
        price: 89990,
        color: "Фиолетовый",
        storage: "128 ГБ"
    },
    {
        id: 5,
        brand: "Apple",
        category: "iPad",
        model: "iPad Pro 12.9\"",
        price: 89990,
        color: "Серый",
        storage: "256 ГБ"
    },
    {
        id: 6,
        brand: "Apple",
        category: "iPad",
        model: "iPad Air",
        price: 59990,
        color: "Розовый",
        storage: "64 ГБ"
    },
    {
        id: 7,
        brand: "Apple",
        category: "Mac",
        model: "MacBook Air M2",
        price: 119990,
        color: "Серебристый",
        storage: "256 ГБ"
    },
    {
        id: 8,
        brand: "Apple",
        category: "Mac",
        model: "MacBook Pro 14\"",
        price: 199990,
        color: "Серый",
        storage: "512 ГБ"
    },
    {
        id: 9,
        brand: "Apple",
        category: "Аксессуары",
        model: "AirPods Pro 2",
        price: 19990,
        color: "Белый",
        storage: "N/A"
    },
    {
        id: 10,
        brand: "Apple",
        category: "Аксессуары",
        model: "Apple Watch Series 9",
        price: 29990,
        color: "Розовый",
        storage: "N/A"
    }
];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('category-filter');
const colorFilter = document.getElementById('color-filter');
const storageFilter = document.getElementById('storage-filter');
const priceSort = document.getElementById('price-sort');

// State
let filteredProducts = [...productsData];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    populateFilters();
    renderProducts();
    setupEventListeners();
});

// Populate filter options
function populateFilters() {
    // Get unique colors
    const colors = [...new Set(productsData.map(product => product.color))];
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorFilter.appendChild(option);
    });

    // Get unique storage options
    const storages = [...new Set(productsData.map(product => product.storage))];
    storages.forEach(storage => {
        const option = document.createElement('option');
        option.value = storage;
        option.textContent = storage;
        storageFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    categoryFilter.addEventListener('change', filterProducts);
    colorFilter.addEventListener('change', filterProducts);
    storageFilter.addEventListener('change', filterProducts);
    priceSort.addEventListener('change', sortProducts);
}

// Filter products based on selected criteria
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const selectedColor = colorFilter.value;
    const selectedStorage = storageFilter.value;

    filteredProducts = productsData.filter(product => {
        const categoryMatch = !selectedCategory || product.category === selectedCategory;
        const colorMatch = !selectedColor || product.color === selectedColor;
        const storageMatch = !selectedStorage || product.storage === selectedStorage;
        
        return categoryMatch && colorMatch && storageMatch;
    });

    renderProducts();
}

// Sort products
function sortProducts() {
    const sortValue = priceSort.value;
    
    switch(sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.model.localeCompare(b.model));
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    renderProducts();
}

// Render products to the grid
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                📱
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.model}</h3>
                <div class="product-brand">${product.brand}</div>
                <div class="product-specs">
                    <span class="spec-badge color">${product.color}</span>
                    <span class="spec-badge">${product.storage}</span>
                </div>
                <div class="product-price">${product.price.toLocaleString()}</div>
                <button class="buy-button" onclick="handleBuyClick(${product.id})">
                    Купить
                </button>
            </div>
        </div>
    `).join('');
}

// Handle buy button click
function handleBuyClick(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        alert(`Вы выбрали: ${product.model}\nЦена: ${product.price.toLocaleString()} ₽\n\nДля оформления заказа свяжитесь с нами!`);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state
function showLoading() {
    productsGrid.innerHTML = '<div class="loading">Загрузка товаров...</div>';
}

// Function to load data from Excel (placeholder)
function loadDataFromExcel() {
    showLoading();
    
    // В реальном проекте здесь будет код для чтения Excel файла
    // Например, используя библиотеку SheetJS или отправка на сервер
    setTimeout(() => {
        renderProducts();
    }, 1000);
}

// Search functionality
function searchProducts(query) {
    if (!query.trim()) {
        filteredProducts = [...productsData];
    } else {
        filteredProducts = productsData.filter(product => 
            product.model.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.color.toLowerCase().includes(query.toLowerCase())
        );
    }
    renderProducts();
}

// Add search input dynamically
function addSearchInput() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="filter-group">
            <label for="search-input">Поиск:</label>
            <input 
                type="text" 
                id="search-input" 
                class="filter-select" 
                placeholder="Поиск по названию, категории или цвету..."
            >
        </div>
    `;
    
    const filterControls = document.querySelector('.filter-controls');
    filterControls.insertBefore(searchContainer, filterControls.firstChild);
    
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
}

// Initialize search
addSearchInput();

// Add some interactive features
function addProductHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.product-card')) {
            e.target.closest('.product-card').style.transform = 'translateY(-8px)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.product-card')) {
            e.target.closest('.product-card').style.transform = 'translateY(0)';
        }
    });
}

// Initialize hover effects
addProductHoverEffects();

// Add category highlighting
function highlightCategory(category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (card.dataset.category === category) {
            card.style.border = '2px solid #0071e3';
        } else {
            card.style.border = 'none';
        }
    });
}

// Add click handlers for category links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.textContent;
        categoryFilter.value = category;
        filterProducts();
        highlightCategory(category);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Clear all filters
        categoryFilter.value = '';
        colorFilter.value = '';
        storageFilter.value = '';
        priceSort.value = 'default';
        filterProducts();
    }
});

// Add product counter
function updateProductCounter() {
    const counter = document.createElement('div');
    counter.className = 'product-counter';
    counter.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        font-size: 17px;
        color: #8e8e93;
    `;
    
    function updateCounter() {
        counter.textContent = `Показано ${filteredProducts.length} из ${productsData.length} товаров`;
    }
    
    updateCounter();
    
    const productsSection = document.querySelector('.products-section .container');
    productsSection.insertBefore(counter, productsGrid);
    
    // Update counter when products change
    const originalRenderProducts = renderProducts;
    renderProducts = function() {
        originalRenderProducts();
        updateCounter();
    };
}

// Initialize product counter
updateProductCounter();

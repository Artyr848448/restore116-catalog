// Mobile Menu Helper - универсальная функция для добавления бургер-меню
function addMobileMenuToPage(menuItems) {
    // Добавляем бургер-меню в навигацию
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('burger-menu')) {
        const burgerMenu = document.createElement('div');
        burgerMenu.className = 'burger-menu';
        burgerMenu.id = 'burger-menu';
        burgerMenu.innerHTML = `
            <div class="burger-line"></div>
            <div class="burger-line"></div>
            <div class="burger-line"></div>
        `;
        navMenu.parentNode.appendChild(burgerMenu);
    }

    // Добавляем мобильное меню после header
    const header = document.querySelector('header');
    if (header && !document.getElementById('mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'mobile-menu';
        
        let menuHTML = '';
        menuItems.forEach(item => {
            const activeClass = item.active ? 'active' : '';
            menuHTML += `<a href="${item.href}" class="nav-link ${activeClass}">${item.text}</a>`;
        });
        
        mobileMenu.innerHTML = menuHTML;
        header.parentNode.insertBefore(mobileMenu, header.nextSibling);
    }

    // Инициализируем функциональность
    initMobileMenu();
}

function initMobileMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Закрыть меню при клике на ссылку
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Закрыть меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!burgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Автоматически добавляем бургер-меню при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую страницу и создаем соответствующие пункты меню
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    let menuItems = [
        { href: 'index.html', text: 'Главная', active: currentPage === 'index.html' },
        { href: 'apple-store.html', text: 'Все товары', active: currentPage === 'apple-store.html' },
        { href: 'iphone-models.html', text: 'iPhone', active: currentPage.includes('iphone') },
        { href: 'ipad-models.html', text: 'iPad', active: currentPage.includes('ipad') },
        { href: 'mac-models.html', text: 'Mac', active: currentPage.includes('mac') },
        { href: 'headphones-models.html', text: 'Наушники', active: currentPage.includes('headphones') },
        { href: 'accessories-models.html', text: 'Аксессуары', active: currentPage.includes('accessories') }
    ];

    addMobileMenuToPage(menuItems);
    
    // Скрываем элементы поиска на внутренних страницах
    hideSearchElementsOnModelPages();
    
    // Постоянно скрываем элементы поиска
    setInterval(hideSearchElementsOnModelPages, 100);
});

function hideSearchElementsOnModelPages() {
    // Проверяем, есть ли на странице секция с моделями
    const modelsSection = document.querySelector('.models-section');
    if (modelsSection) {
        // Скрываем все элементы поиска и фильтрации
        const searchElements = document.querySelectorAll('.filter-section, .filter-controls, .search-section, .filter-container, .filter-group, .filter-select, .filter-label, .search-input, .search-box, .search-form');
        searchElements.forEach(element => {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.height = '0';
            element.style.padding = '0';
            element.style.margin = '0';
            element.style.overflow = 'hidden';
        });
        
        // Скрываем все элементы с классами, содержащими filter или search
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const className = element.className || '';
            const id = element.id || '';
            if (className.includes('filter') || className.includes('search') || 
                id.includes('filter') || id.includes('search')) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.height = '0';
                element.style.padding = '0';
                element.style.margin = '0';
                element.style.overflow = 'hidden';
            }
        });
        
        // Уменьшаем hero-секцию
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.minHeight = '60vh';
            hero.style.padding = '100px 0 60px';
        }
    }
}

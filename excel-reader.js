// Excel Reader для интеграции с данными из Excel файла
// Этот файл содержит функции для чтения и обработки данных из Excel

// Функция для конвертации Excel данных в JSON формат
function convertExcelToJSON(excelData) {
    // Предполагаем, что Excel файл имеет следующие колонки:
    // A: Модель, B: Бренд, C: Категория, D: Цена, E: Цвет, F: ГБ
    
    const products = [];
    
    // Пропускаем заголовки (первая строка)
    for (let i = 1; i < excelData.length; i++) {
        const row = excelData[i];
        
        if (row && row.length >= 6) {
            const product = {
                id: i,
                model: row[0] || '', // Модель
                brand: row[1] || 'Apple', // Бренд
                category: row[2] || '', // Категория
                price: parseFloat(row[3]) || 0, // Цена
                color: row[4] || '', // Цвет
                storage: row[5] ? `${row[5]} ГБ` : 'N/A' // ГБ
            };
            
            // Добавляем только если есть основные данные
            if (product.model && product.category) {
                products.push(product);
            }
        }
    }
    
    return products;
}

// Функция для загрузки данных из Excel файла (требует библиотеку SheetJS)
function loadExcelData(filePath) {
    return new Promise((resolve, reject) => {
        // Проверяем, загружена ли библиотека SheetJS
        if (typeof XLSX === 'undefined') {
            // Загружаем библиотеку динамически
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            script.onload = () => {
                loadExcelFile(filePath).then(resolve).catch(reject);
            };
            script.onerror = () => reject(new Error('Не удалось загрузить библиотеку SheetJS'));
            document.head.appendChild(script);
        } else {
            loadExcelFile(filePath).then(resolve).catch(reject);
        }
    });
}

// Внутренняя функция для загрузки Excel файла
function loadExcelFile(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                const products = convertExcelToJSON(jsonData);
                resolve(products);
            })
            .catch(error => {
                console.error('Ошибка при загрузке Excel файла:', error);
                reject(error);
            });
    });
}

// Функция для обновления данных в основном приложении
function updateProductsFromExcel(excelProducts) {
    // Обновляем глобальную переменную productsData
    if (typeof window !== 'undefined' && window.productsData) {
        window.productsData = excelProducts;
        
        // Обновляем фильтры
        updateFiltersFromData(excelProducts);
        
        // Перерисовываем товары
        if (typeof window !== 'undefined' && window.renderProducts) {
            window.filteredProducts = [...excelProducts];
            window.renderProducts();
        }
    }
}

// Функция для обновления фильтров на основе новых данных
function updateFiltersFromData(products) {
    if (typeof window === 'undefined') return;
    
    // Обновляем фильтр цветов
    const colorFilter = document.getElementById('color-filter');
    if (colorFilter) {
        // Очищаем существующие опции (кроме первой)
        while (colorFilter.children.length > 1) {
            colorFilter.removeChild(colorFilter.lastChild);
        }
        
        // Добавляем новые цвета
        const colors = [...new Set(products.map(product => product.color))];
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorFilter.appendChild(option);
        });
    }
    
    // Обновляем фильтр памяти
    const storageFilter = document.getElementById('storage-filter');
    if (storageFilter) {
        // Очищаем существующие опции (кроме первой)
        while (storageFilter.children.length > 1) {
            storageFilter.removeChild(storageFilter.lastChild);
        }
        
        // Добавляем новые варианты памяти
        const storages = [...new Set(products.map(product => product.storage))];
        storages.forEach(storage => {
            const option = document.createElement('option');
            option.value = storage;
            option.textContent = storage;
            storageFilter.appendChild(option);
        });
    }
}

// Функция для экспорта данных в Excel
function exportToExcel(products, filename = 'products.xlsx') {
    if (typeof XLSX === 'undefined') {
        console.error('Библиотека SheetJS не загружена');
        return;
    }
    
    // Подготавливаем данные для экспорта
    const exportData = [
        ['Модель', 'Бренд', 'Категория', 'Цена', 'Цвет', 'ГБ'], // Заголовки
        ...products.map(product => [
            product.model,
            product.brand,
            product.category,
            product.price,
            product.color,
            product.storage.replace(' ГБ', '')
        ])
    ];
    
    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Товары');
    
    // Скачиваем файл
    XLSX.writeFile(wb, filename);
}

// Функция для валидации данных Excel
function validateExcelData(products) {
    const errors = [];
    
    products.forEach((product, index) => {
        if (!product.model) {
            errors.push(`Строка ${index + 1}: Отсутствует модель`);
        }
        if (!product.category) {
            errors.push(`Строка ${index + 1}: Отсутствует категория`);
        }
        if (!product.price || product.price <= 0) {
            errors.push(`Строка ${index + 1}: Некорректная цена`);
        }
        if (!product.color) {
            errors.push(`Строка ${index + 1}: Отсутствует цвет`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Функция для обработки ошибок загрузки
function handleExcelError(error) {
    console.error('Ошибка при работе с Excel файлом:', error);
    
    // Показываем пользователю сообщение об ошибке
    if (typeof window !== 'undefined') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #ff3b30;
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin: 20px;
            text-align: center;
            font-size: 17px;
        `;
        errorDiv.textContent = 'Ошибка при загрузке данных из Excel файла. Используются демо-данные.';
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
            
            // Убираем сообщение через 5 секунд
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
    }
}

// Экспортируем функции для использования в основном скрипте
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertExcelToJSON,
        loadExcelData,
        updateProductsFromExcel,
        updateFiltersFromData,
        exportToExcel,
        validateExcelData,
        handleExcelError
    };
}

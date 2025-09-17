#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import os

def convert_csv_to_json():
    """
    Конвертирует все CSV файлы в JSON формат для веб-каталога
    """
    try:
        print("🚀 Начинаем конвертацию CSV файлов в JSON...")
        print("=" * 60)
        
        all_products = []
        
        # Список CSV файлов и их категории для веб-каталога
        csv_files = {
            'Смартфоны.csv': 'iPhone',
            'Планшеты.csv': 'iPad', 
            'Ноутбуки.csv': 'Mac',
            'Часы.csv': 'Аксессуары',
            'Наушники.csv': 'Наушники'
        }
        
        for csv_file, web_category in csv_files.items():
            if os.path.exists(csv_file):
                print(f"\n🔍 Обрабатываем файл: {csv_file}")
                
                try:
                    # Читаем CSV файл
                    df = pd.read_csv(csv_file, encoding='utf-8')
                    print(f"   📋 Строк: {len(df)}")
                    
                    # Конвертируем в нужный формат
                    products = convert_csv_to_products(df, web_category)
                    all_products.extend(products)
                    
                    print(f"   ✅ Обработано товаров: {len(products)}")
                    
                    # Показываем примеры
                    if products:
                        print(f"   📱 Примеры:")
                        for i, product in enumerate(products[:2]):
                            print(f"     {i+1}. {product['model']} - {product['price']:,.0f} ₽")
                    
                except Exception as e:
                    print(f"   ❌ Ошибка при обработке файла '{csv_file}': {e}")
                    continue
            else:
                print(f"   ⚠️ Файл {csv_file} не найден")
        
        print(f"\n🎉 Общий итог:")
        print(f"📊 Всего обработано товаров: {len(all_products)}")
        
        # Сохраняем в JSON файл
        with open('products.json', 'w', encoding='utf-8') as f:
            json.dump(all_products, f, ensure_ascii=False, indent=2)
        
        print(f"💾 JSON файл сохранен: products.json")
        
        # Показываем статистику по категориям
        categories = {}
        for product in all_products:
            cat = product['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        print(f"\n📊 Статистика по категориям:")
        for cat, count in categories.items():
            print(f"   {cat}: {count} товаров")
        
        # Показываем примеры товаров
        print(f"\n📱 Примеры товаров:")
        for i, product in enumerate(all_products[:5]):
            print(f"   {i+1}. {product['model']} - {product['price']:,} ₽ ({product['color']}, {product['storage']})")
        
        return all_products
        
    except Exception as e:
        print(f"❌ Ошибка при обработке файлов: {e}")
        return None

def convert_csv_to_products(df, web_category):
    """
    Конвертирует данные из CSV файла в формат товаров
    """
    products = []
    
    for index, row in df.iterrows():
        try:
            # Пропускаем пустые строки или строки с заголовками
            if pd.isna(row.iloc[0]) or str(row.iloc[0]).startswith('—') or str(row.iloc[0]).startswith('Категория'):
                continue
            
            # Извлекаем данные из колонок
            category = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
            brand = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else 'Apple'
            lineup = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ''
            model = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else ''
            submodel = str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else ''
            variant = str(row.iloc[5]).strip() if pd.notna(row.iloc[5]) else ''
            color = str(row.iloc[6]).strip() if pd.notna(row.iloc[6]) else ''
            gb = str(row.iloc[8]).strip() if pd.notna(row.iloc[8]) else ''
            price = float(row.iloc[9]) if pd.notna(row.iloc[9]) and str(row.iloc[9]).replace('.', '').isdigit() else 0
            
            # Формируем полное название модели
            full_model = f"{model} {submodel}".strip()
            if variant and variant != '—':
                full_model += f" {variant}"
            
            # Формируем объем памяти
            storage = f"{gb}" if gb and gb != 'nan' and gb != '—' else 'N/A'
            
            # Создаем объект товара
            product = {
                'id': len(products) + 1,
                'model': full_model,
                'brand': brand,
                'category': web_category,
                'price': int(price),
                'color': color,
                'storage': storage
            }
            
            # Добавляем только если есть основные данные и цена больше 0
            if product['model'] and product['category'] and product['price'] > 0:
                products.append(product)
                
        except Exception as e:
            # Пропускаем проблемные строки
            continue
    
    return products

if __name__ == "__main__":
    products = convert_csv_to_json()
    
    if products:
        print("=" * 60)
        print("🎉 Конвертация завершена успешно!")
        print(f"📊 Обработано товаров: {len(products)}")
        print("🌐 Теперь обновите страницу apple-store.html в браузере")
    else:
        print("❌ Конвертация не удалась")

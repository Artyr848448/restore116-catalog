#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import sys
import os

def convert_excel_to_json(excel_file, output_file='products.json'):
    """
    Конвертирует все вкладки Excel файла в JSON формат для веб-каталога
    """
    try:
        print(f"📊 Читаем Excel файл: {excel_file}")
        
        # Читаем все вкладки
        excel_file_obj = pd.ExcelFile(excel_file)
        sheet_names = excel_file_obj.sheet_names
        
        print(f"✅ Файл прочитан успешно!")
        print(f"📋 Найдено вкладок: {len(sheet_names)}")
        
        all_products = []
        
        # Обрабатываем каждую вкладку с товарами
        product_sheets = ['Смартфоны', 'Планшеты', 'Ноутбуки', 'Часы', 'Наушники']
        
        for sheet_name in product_sheets:
            if sheet_name in sheet_names:
                print(f"\n🔍 Обрабатываем вкладку: '{sheet_name}'")
                
                try:
                    df = pd.read_excel(excel_file, sheet_name=sheet_name)
                    print(f"   📋 Строк: {len(df)}")
                    
                    # Конвертируем в нужный формат
                    products = convert_sheet_to_products(df, sheet_name)
                    all_products.extend(products)
                    
                    print(f"   ✅ Обработано товаров: {len(products)}")
                    
                    # Показываем примеры
                    if products:
                        print(f"   📱 Примеры:")
                        for i, product in enumerate(products[:2]):
                            print(f"     {i+1}. {product['model']} - {product['price']:,.0f} ₽")
                    
                except Exception as e:
                    print(f"   ❌ Ошибка при обработке вкладки '{sheet_name}': {e}")
                    continue
        
        print(f"\n🎉 Общий итог:")
        print(f"📊 Всего обработано товаров: {len(all_products)}")
        
        # Сохраняем в JSON файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_products, f, ensure_ascii=False, indent=2)
        
        print(f"💾 JSON файл сохранен: {output_file}")
        
        # Показываем статистику по категориям
        categories = {}
        for product in all_products:
            cat = product['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        print(f"\n📊 Статистика по категориям:")
        for cat, count in categories.items():
            print(f"   {cat}: {count} товаров")
        
        return all_products
        
    except Exception as e:
        print(f"❌ Ошибка при обработке файла: {e}")
        return None

def convert_sheet_to_products(df, sheet_name):
    """
    Конвертирует данные из одной вкладки в формат товаров
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
            
            # Формируем категорию для веб-каталога
            web_category = get_web_category(category, lineup)
            
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

def get_web_category(excel_category, lineup):
    """
    Преобразует категории из Excel в категории для веб-каталога
    """
    if 'Смартфон' in excel_category or 'iPhone' in lineup:
        return 'iPhone'
    elif 'Планшет' in excel_category or 'iPad' in lineup:
        return 'iPad'
    elif 'Ноутбук' in excel_category or 'Mac' in lineup:
        return 'Mac'
    elif 'Часы' in excel_category or 'Watch' in lineup:
        return 'Аксессуары'
    elif 'Наушники' in excel_category or 'AirPods' in lineup:
        return 'Аксессуары'
    else:
        return excel_category

def main():
    excel_file = "Айфоны Матрица.xlsx"
    
    if not os.path.exists(excel_file):
        print(f"❌ Файл {excel_file} не найден!")
        return
    
    print("🚀 Начинаем конвертацию Excel в JSON...")
    print("=" * 60)
    
    products = convert_excel_to_json(excel_file)
    
    if products:
        print("=" * 60)
        print("🎉 Конвертация завершена успешно!")
        print(f"📊 Обработано товаров: {len(products)}")
        print("🌐 Теперь обновите страницу apple-store.html в браузере")
        
        # Показываем примеры товаров
        print(f"\n📱 Примеры товаров:")
        for i, product in enumerate(products[:5]):
            print(f"   {i+1}. {product['model']} - {product['price']:,} ₽ ({product['color']}, {product['storage']})")
    else:
        print("❌ Конвертация не удалась")

if __name__ == "__main__":
    main()

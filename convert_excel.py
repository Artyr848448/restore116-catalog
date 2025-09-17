#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import sys
import os

def convert_excel_to_json(excel_file, output_file='products.json'):
    """
    Конвертирует Excel файл в JSON формат для веб-каталога
    """
    try:
        print(f"📊 Читаем Excel файл: {excel_file}")
        
        # Читаем Excel файл
        df = pd.read_excel(excel_file)
        
        print(f"✅ Файл прочитан успешно!")
        print(f"📋 Найдено строк: {len(df)}")
        print(f"📋 Колонки: {list(df.columns)}")
        
        # Показываем первые несколько строк для проверки
        print("\n🔍 Первые 3 строки данных:")
        print(df.head(3).to_string())
        
        # Конвертируем в нужный формат
        products = []
        
        for index, row in df.iterrows():
            # Создаем объект товара
            product = {
                'id': index + 1,
                'model': str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else '',  # Модель
                'brand': str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else 'Apple',  # Бренд
                'category': str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else '',  # Категория
                'price': float(row.iloc[3]) if pd.notna(row.iloc[3]) and str(row.iloc[3]).replace('.', '').replace(',', '').isdigit() else 0,  # Цена
                'color': str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else '',  # Цвет
                'storage': f"{int(row.iloc[5])} ГБ" if pd.notna(row.iloc[5]) and str(row.iloc[5]).replace('.', '').isdigit() else 'N/A'  # ГБ
            }
            
            # Добавляем только если есть основные данные
            if product['model'] and product['category']:
                products.append(product)
        
        print(f"\n✅ Обработано товаров: {len(products)}")
        
        # Сохраняем в JSON файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"💾 JSON файл сохранен: {output_file}")
        
        # Показываем примеры обработанных товаров
        print("\n📱 Примеры обработанных товаров:")
        for i, product in enumerate(products[:3]):
            print(f"{i+1}. {product['model']} - {product['price']:,.0f} ₽ ({product['color']}, {product['storage']})")
        
        return products
        
    except Exception as e:
        print(f"❌ Ошибка при обработке файла: {e}")
        return None

def main():
    excel_file = "Айфоны Матрица.xlsx"
    
    if not os.path.exists(excel_file):
        print(f"❌ Файл {excel_file} не найден!")
        print("Убедитесь, что файл находится в той же папке, что и скрипт.")
        return
    
    print("🚀 Начинаем конвертацию Excel в JSON...")
    print("=" * 50)
    
    products = convert_excel_to_json(excel_file)
    
    if products:
        print("=" * 50)
        print("🎉 Конвертация завершена успешно!")
        print(f"📊 Обработано товаров: {len(products)}")
        print("🌐 Теперь обновите страницу apple-store.html в браузере")
    else:
        print("❌ Конвертация не удалась")

if __name__ == "__main__":
    main()

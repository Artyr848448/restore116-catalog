#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import sys

def check_excel_structure(excel_file):
    """
    Проверяет структуру Excel файла и показывает все вкладки
    """
    try:
        print(f"📊 Анализируем Excel файл: {excel_file}")
        print("=" * 60)
        
        # Читаем все вкладки
        excel_file_obj = pd.ExcelFile(excel_file)
        sheet_names = excel_file_obj.sheet_names
        
        print(f"📋 Найдено вкладок: {len(sheet_names)}")
        print(f"📋 Названия вкладок: {sheet_names}")
        print()
        
        # Анализируем каждую вкладку
        for i, sheet_name in enumerate(sheet_names):
            print(f"🔍 Вкладка {i+1}: '{sheet_name}'")
            print("-" * 40)
            
            try:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                print(f"   Строк: {len(df)}")
                print(f"   Колонок: {len(df.columns)}")
                print(f"   Колонки: {list(df.columns)}")
                
                # Показываем первые несколько строк
                if len(df) > 0:
                    print("   Первые 3 строки:")
                    for j, row in df.head(3).iterrows():
                        print(f"     {j+1}: {list(row.values)}")
                else:
                    print("   (пустая вкладка)")
                    
            except Exception as e:
                print(f"   ❌ Ошибка при чтении: {e}")
            
            print()
        
        # Ищем вкладку с товарами
        print("🔍 Поиск вкладки с товарами...")
        for sheet_name in sheet_names:
            try:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                if len(df) > 1 and len(df.columns) >= 4:  # Есть данные и достаточно колонок
                    print(f"✅ Возможно, это вкладка с товарами: '{sheet_name}'")
                    print(f"   Строк: {len(df)}, Колонок: {len(df.columns)}")
                    print(f"   Колонки: {list(df.columns)}")
                    
                    # Показываем первые строки
                    print("   Примеры данных:")
                    for j, row in df.head(3).iterrows():
                        print(f"     {j+1}: {list(row.values)}")
                    print()
                    
            except Exception as e:
                continue
                
    except Exception as e:
        print(f"❌ Ошибка при анализе файла: {e}")

if __name__ == "__main__":
    check_excel_structure("Айфоны Матрица.xlsx")

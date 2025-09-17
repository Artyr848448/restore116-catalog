#!/bin/bash
echo "🚀 Обновляю сайт..."
git add .
git commit -m "Обновление каталога $(date)"
git push
echo "✅ Сайт обновлен! Проверьте через 1-2 минуты:"
echo "https://artyr848448.github.io/restore116-catalog/"

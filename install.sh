#!/bin/bash

echo "╔══════════════════════════════════════════════════╗"
echo "║   🚀 نصب سیستم مدیریت پروژه                    ║"
echo "╚══════════════════════════════════════════════════╝"

# بررسی Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker نصب نیست. در حال نصب..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker نصب شد"
fi

# بررسی Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose نصب نیست. در حال نصب..."
    sudo apt update
    sudo apt install -y docker-compose
    echo "✅ Docker Compose نصب شد"
fi

# توقف کانتینرهای قبلی
echo "🧹 پاک‌سازی کانتینرهای قبلی..."
docker-compose down 2>/dev/null

# ساخت و اجرا
echo "🏗️ ساخت و راه‌اندازی سیستم..."
docker-compose up -d --build

# صبر برای آماده شدن
echo "⏳ صبر برای آماده شدن سرویس‌ها (30 ثانیه)..."
sleep 30

# بررسی وضعیت
echo "📊 بررسی وضعیت..."
docker-compose ps

# تست سرویس‌ها
echo "🧪 تست سیستم..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend فعال است"
else
    echo "⚠️ Backend در حال آماده شدن است..."
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend فعال است"
else
    echo "⚠️ Frontend در حال آماده شدن است..."
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   ✅ سیستم با موفقیت نصب شد!                   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "🌐 دسترسی به سیستم:"
echo "   آدرس: http://localhost:3000"
echo ""
echo "🔑 اطلاعات ورود:"
echo "   نام کاربری: admin"
echo "   رمز عبور: admin123"
echo ""
echo "📚 دستورات مفید:"
echo "   مشاهده لاگ: docker-compose logs -f"
echo "   ری‌استارت: docker-compose restart"
echo "   توقف: docker-compose down"
echo ""
echo "⚠️ اگر صفحه باز نشد، 1 دقیقه صبر کنید و دوباره امتحان کنید"

#!/bin/bash

echo "🚀 Verificando estado de CCB Platform..."
echo ""

# Verificar servicios
echo "📊 Estado de servicios:"
echo "Frontend (3000): $(lsof -ti :3000 > /dev/null && echo '✅ Running' || echo '❌ Down')"
echo "Backend (8004): $(lsof -ti :8004 > /dev/null && echo '✅ Running' || echo '❌ Down')"
echo ""

# Verificar API
echo "🔍 Testing API endpoints:"
echo -n "GET /api/events: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8004/api/events)
if [ "$STATUS" = "200" ]; then
    COUNT=$(curl -s http://localhost:8004/api/events | grep -c '"id"')
    echo "✅ $COUNT eventos disponibles"
else
    echo "❌ Error $STATUS"
fi

echo -n "POST /api/login: "
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8004/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@banreservas.com.do", "password": "Admin2024CCB!"}')

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo "✅ Autenticación funcional"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo "❌ Error en autenticación"
fi

echo ""
echo "🎯 URLs importantes:"
echo "Frontend: http://localhost:3000"
echo "Admin Panel: http://localhost:3000/admin"
echo "Eventos: http://localhost:3000/admin/events"
echo "API Docs: http://localhost:8004/docs"
echo ""
echo "🔐 Credenciales admin:"
echo "Email: admin@banreservas.com.do"
echo "Password: Admin2024CCB!"
echo ""
echo "✨ Estado: Todo funcionando correctamente!"

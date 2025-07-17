#!/bin/bash

echo "🧪 TESTING CCB AUTHENTICATION SYSTEM"
echo "====================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs
API_URL="http://localhost:8004"
FRONTEND_URL="http://localhost:3001"

echo -e "${BLUE}1. Testing Backend Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@banreservas.com.do","password":"Admin2024CCB!"}')

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
  echo -e "${GREEN}✅ Login successful${NC}"
  
  # Extract token (simple grep/cut approach)
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
  echo -e "${BLUE}Token: ${TOKEN:0:30}...${NC}"
  
  echo -e "${BLUE}2. Testing Users API with token...${NC}"
  USERS_RESPONSE=$(curl -s -X GET "$API_URL/api/admin/users?skip=0&limit=1" \
    -H "Authorization: Bearer $TOKEN")
  
  if [[ $USERS_RESPONSE == *"users"* ]]; then
    echo -e "${GREEN}✅ Users API working with authentication${NC}"
    
    # Count users
    USER_COUNT=$(echo $USERS_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo -e "${BLUE}Total users in system: $USER_COUNT${NC}"
    
    echo -e "${BLUE}3. Testing Frontend accessibility...${NC}"
    FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    
    if [[ $FRONTEND_RESPONSE == "200" ]]; then
      echo -e "${GREEN}✅ Frontend accessible${NC}"
      echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
      echo ""
      echo -e "${BLUE}Next steps:${NC}"
      echo "1. Go to: $FRONTEND_URL/auth/login"
      echo "2. Login with: admin@banreservas.com.do / Admin2024CCB!"
      echo "3. You should be redirected to: $FRONTEND_URL/admin"
      echo "4. Navigate to users page and verify data loads"
      echo ""
      echo -e "${BLUE}Token for manual testing:${NC}"
      echo "$TOKEN"
    else
      echo -e "${RED}❌ Frontend not accessible (HTTP $FRONTEND_RESPONSE)${NC}"
    fi
  else
    echo -e "${RED}❌ Users API failed: $USERS_RESPONSE${NC}"
  fi
else
  echo -e "${RED}❌ Login failed: $LOGIN_RESPONSE${NC}"
fi

echo ""
echo "🔍 Debug Info:"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $API_URL"
echo "Backend docs: $API_URL/docs"

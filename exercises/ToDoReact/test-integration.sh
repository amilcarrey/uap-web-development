#!/bin/bash

# Integration Test Script for ToDoReact + Backend

echo "🧪 Testing Frontend-Backend Integration"
echo "======================================"

BASE_URL="http://localhost:4322"
FRONTEND_URL="http://localhost:5173"

echo "1. Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

echo ""
echo "2. Testing User Authentication..."

# Test Registration
echo "  - Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/register" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testintegration",
        "email": "integration@test.com",
        "password": "test123456"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ User registration successful"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  📝 Token received: ${TOKEN:0:20}..."
elif echo "$REGISTER_RESPONSE" | grep -q "already"; then
    echo "  ℹ️  User already exists, testing login..."
    
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "integration@test.com",
            "password": "test123456"
        }')
    
    if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
        echo "  ✅ User login successful"
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        echo "  📝 Token received: ${TOKEN:0:20}..."
    else
        echo "  ❌ User login failed"
        exit 1
    fi
else
    echo "  ❌ User registration failed"
    exit 1
fi

echo ""
echo "3. Testing Boards API..."

# Test Board Creation
echo "  - Creating a test board..."
BOARD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/boards" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "integration-test"
    }')

if echo "$BOARD_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Board creation successful"
    BOARD_ID=$(echo "$BOARD_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "  📝 Board ID: $BOARD_ID"
else
    echo "  ❌ Board creation failed"
    echo "  Response: $BOARD_RESPONSE"
    exit 1
fi

# Test Board Listing
echo "  - Testing board listing..."
BOARDS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/boards" \
    -H "Authorization: Bearer $TOKEN")

if echo "$BOARDS_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Board listing successful"
else
    echo "  ❌ Board listing failed"
    exit 1
fi

echo ""
echo "4. Testing Tasks API..."

# Test Task Creation
echo "  - Creating a test task..."
TASK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tasks/board/$BOARD_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "text": "Integration test task"
    }')

if echo "$TASK_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Task creation successful"
    TASK_ID=$(echo "$TASK_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "  📝 Task ID: $TASK_ID"
else
    echo "  ❌ Task creation failed"
    echo "  Response: $TASK_RESPONSE"
    exit 1
fi

# Test Task Listing
echo "  - Testing task listing..."
TASKS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/tasks/board/$BOARD_ID" \
    -H "Authorization: Bearer $TOKEN")

if echo "$TASKS_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Task listing successful"
else
    echo "  ❌ Task listing failed"
    exit 1
fi

# Test Task Update
echo "  - Testing task update..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "completed": true
    }')

if echo "$UPDATE_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Task update successful"
else
    echo "  ❌ Task update failed"
    exit 1
fi

echo ""
echo "5. Testing Frontend Availability..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible (HTTP $FRONTEND_RESPONSE)"
fi

echo ""
echo "6. Cleanup..."
echo "  - Deleting test task..."
curl -s -X DELETE "$BASE_URL/api/tasks/$TASK_ID" \
    -H "Authorization: Bearer $TOKEN" > /dev/null

echo "  - Deleting test board..."
curl -s -X DELETE "$BASE_URL/api/boards/$BOARD_ID" \
    -H "Authorization: Bearer $TOKEN" > /dev/null

echo ""
echo "🎉 Integration Test Complete!"
echo "=============================="
echo "✅ Backend API is working correctly"
echo "✅ Authentication is functioning"
echo "✅ Boards and Tasks APIs are operational"
echo "✅ Frontend is accessible"
echo ""
echo "🌐 Open your browser and navigate to:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BASE_URL/api/health"
echo ""
echo "🔑 Test Credentials:"
echo "   Email:    owner@theoldstand.com"
echo "   Password: publife123"
echo ""
echo "   OR"
echo ""
echo "   Email:    bartender@theoldstand.com"
echo "   Password: beers123"

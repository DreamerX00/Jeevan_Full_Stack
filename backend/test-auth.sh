#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL for the API
BASE_URL="http://localhost:8080"

# Test email and password
EMAIL="test@example.com"
PASSWORD="password123"
NEW_USER_EMAIL="newuser@example.com"
NEW_USER_PASSWORD="password123"

echo -e "${BLUE}Starting API test script...${NC}"

# Test 1: Health check
echo -e "\n${BLUE}Test 1: Checking API health...${NC}"
HEALTH_RESPONSE=$(curl -s "${BASE_URL}/api/public/test/health")
echo $HEALTH_RESPONSE
if [[ $HEALTH_RESPONSE == *"connected"* ]]; then
  echo -e "${GREEN}✓ API is healthy and database is connected${NC}"
else
  echo -e "${RED}✗ API health check failed${NC}"
  exit 1
fi

# Test 2: Get database schema
echo -e "\n${BLUE}Test 2: Checking database schema...${NC}"
SCHEMA_RESPONSE=$(curl -s "${BASE_URL}/api/public/test/schema")
echo $SCHEMA_RESPONSE
if [[ $SCHEMA_RESPONSE == *"users_table_columns"* ]]; then
  echo -e "${GREEN}✓ Schema information retrieved successfully${NC}"
else
  echo -e "${RED}✗ Failed to retrieve schema information${NC}"
fi

# Test 3: Register a new user
echo -e "\n${BLUE}Test 3: Registering a new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${NEW_USER_EMAIL}\",\"password\":\"${NEW_USER_PASSWORD}\"}")
echo $REGISTER_RESPONSE

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
  echo -e "${GREEN}✓ User registered successfully${NC}"
  # Extract the token
  NEW_USER_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  echo "Token: $NEW_USER_TOKEN"
else
  echo -e "${RED}✗ User registration failed${NC}"
fi

# Test 4: Login with the same user
echo -e "\n${BLUE}Test 4: Logging in with the registered user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${NEW_USER_EMAIL}\",\"password\":\"${NEW_USER_PASSWORD}\"}")
echo $LOGIN_RESPONSE

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
  echo -e "${GREEN}✓ User logged in successfully${NC}"
  # Extract the token
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  echo "Token: $TOKEN"
else
  echo -e "${RED}✗ User login failed${NC}"
  exit 1
fi

# Test 5: Access a protected endpoint (dashboard info)
echo -e "\n${BLUE}Test 5: Accessing protected dashboard info...${NC}"
DASHBOARD_RESPONSE=$(curl -s "${BASE_URL}/api/dashboard/info" \
  -H "Authorization: Bearer $TOKEN")
echo $DASHBOARD_RESPONSE

if [[ $DASHBOARD_RESPONSE == *"email"* && $DASHBOARD_RESPONSE == *"greeting"* ]]; then
  echo -e "${GREEN}✓ Dashboard info accessed successfully${NC}"
else
  echo -e "${RED}✗ Failed to access dashboard info${NC}"
fi

# Test 6: Try accessing a protected endpoint without a token
echo -e "\n${BLUE}Test 6: Trying to access protected endpoint without token...${NC}"
UNAUTHORIZED_RESPONSE=$(curl -s -I "${BASE_URL}/api/dashboard/info")
echo "$UNAUTHORIZED_RESPONSE"

if [[ $UNAUTHORIZED_RESPONSE == *"401"* ]]; then
  echo -e "${GREEN}✓ Unauthorized access correctly rejected${NC}"
else
  echo -e "${RED}✗ Security check failed - was able to access protected resource without token${NC}"
fi

echo -e "\n${BLUE}All tests completed!${NC}" 
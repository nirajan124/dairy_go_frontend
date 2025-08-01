# Fix Admin Profile Authentication Issues

## Step 1: Start Backend Server

```bash
cd web_api_backend-main/dairy_go_backend
npm start
```

## Step 2: Create Admin User (if not exists)

```bash
cd web_api_backend-main/dairy_go_backend
node setup-admin.js
```

## Step 3: Test Backend Connection

The backend should be running on http://localhost:3001

## Step 4: Get Test Token

1. Go to Admin Profile page
2. Click "Get Test Token" button
3. Wait for success message
4. Page will refresh automatically

## Fixed Issues:

### 1. Route Method Fixed
- Changed `POST /change-password` to `PUT /change-password`
- Now matches frontend API calls

### 2. Backend Server
- Ensure server is running on port 3001
- Check MongoDB connection

### 3. Admin User
- Username: `admin`
- Password: `admin123`
- Email: `admin@dairygo.com`

## Test Commands:

```bash
# Test login
curl -X POST http://localhost:3001/api/v1/admin-auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test profile (with token)
curl -X GET http://localhost:3001/api/v1/admin-auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Results:

✅ Backend server running on port 3001
✅ Admin user exists in database
✅ Login returns JWT token
✅ Profile endpoint returns admin data
✅ No more 401/404 errors 
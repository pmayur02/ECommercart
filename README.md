# ECommercart API

A comprehensive Node.js e-commerce backend API with JWT authentication, cart management, and intelligent promotion engine.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [API Routes & Specifications](#api-routes--specifications)
5. [Schema Layouts](#schema-layouts)
6. [Session Strategy](#session-strategy)
7. [Promotion Formula](#promotion-formula)
8. [Feature: Delete Item from Cart](#feature-delete-item-from-cart)

---

## Features

- **User Authentication**: JWT-based secure authentication
- **Cart Management**: Add, remove, and view cart items
- **Intelligent Promotions**: Multi-tier discount system with diversity bonuses
- **Validation**: Comprehensive Joi schema validation
- **API Documentation**: Swagger UI integration

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (via Mongoose v9.7.1)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: bcrypt v6.0.0
- **Validation**: Joi v18.2.3
- **API Docs**: Swagger UI Express v5.0.1

---

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd ECommercart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the project root:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ecommercart
   SECRET_KEY=your_jwt_secret_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the API**
   - API Base URL: `http://localhost:8000`
   - Swagger Docs: `http://localhost:8000/api/docs`
   - Health Check: `http://localhost:8000/health`

---

## API Routes & Specifications

### Base Endpoints

All endpoints are prefixed with the base URL: `http://localhost:8000`

### 1. User Management

#### Register User
- **Route**: `POST /users/register-user`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "You Registered successfully.",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Validation Rules**:
  - `name`: string, 3-20 characters, letters only (pattern: `/^[A-Za-z ]+$/`)
  - `email`: valid email format
  - `password`: minimum 6 characters

#### Login User
- **Route**: `POST /users/login`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "LoggedIn Successful.",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Validation Rules**:
  - `email`: valid email format
  - `password`: minimum 6 characters

---

### 2. Cart Management

#### Add Item to Cart
- **Route**: `POST /carts/items`
- **Authentication**: Bearer Token (JWT)
- **Request Body**:
  ```json
  {
    "userId": "641a98c12b4f1f0012345678",
    "productId": "prod-001",
    "productName": "Wireless Headphones",
    "category": "electronics",
    "price": 129.99,
    "quantity": 2
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Item added in a cart.",
    "data": { /* item details */ }
  }
  ```
- **Validation Rules**:
  - `userId`: required string
  - `productId`: required string
  - `productName`: letters only
  - `category`: enum ["electronics", "beauty", "clothes", "groceries", "footwear", "other"]
  - `price`: positive number
  - `quantity`: integer, minimum 1

---

#### Remove Item from Cart ⭐ **NEW FEATURE**
- **Route**: `DELETE /carts/items/{userId}/{productId}`
- **Authentication**: Bearer Token (JWT)
- **Path Parameters**:
  - `userId`: The ID of the user whose cart item will be removed
  - `productId`: The ID of the product to remove
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Item removed from cart.",
    "data": {
      "userId": "641a98c12b4f1f0012345678",
      "productId": "prod-001",
      "items": [/* remaining items */]
    }
  }
  ```
- **Error Responses**:
  - **404**: Cart not found or Item not found in cart
  - **401**: Unauthorized (missing/invalid token)
  - **400**: Validation error

---

#### Get Checkout Summary
- **Route**: `GET /carts/checkout/{userId}`
- **Authentication**: Bearer Token (JWT)
- **Path Parameters**:
  - `userId`: The user ID for checkout
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Total fetched Details",
    "data": {
      "items": [ /* cart items */ ],
      "subtotal": 500.00,
      "uniqueCategories": 3,
      "percentageDiscount": 25.00,
      "diversityBonus": 500,
      "totalDiscount": 525.00,
      "finalAmount": 475.00
    }
  }
  ```
- **Calculation Details**:
  - Subtotal: Sum of (price × quantity) for all items
  - Unique Categories: Count of distinct product categories
  - Percentage Discount: Applied based on subtotal tiers
  - Diversity Bonus: Applied based on category count
  - Final Amount: Subtotal - Total Discount + Shipping (if applicable)

---

## Schema Layouts

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required, 3-20 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  status: String (enum: ["active", "inactive"], default: "active"),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  items: [{
    productId: String (required),
    productName: String (required),
    category: String (enum: ["electronics", "beauty", "clothes", "groceries", "footwear", "other"]),
    price: Number (required, min: 0),
    quantity: Number (required, min: 1)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Request Validation Schemas (Joi)

**Item Schema** (POST /carts/items):
- `userId`: string, required
- `productId`: string, required, trimmed
- `productName`: string, required, letters only
- `category`: string, required, one of defined categories
- `price`: positive number, required
- `quantity`: integer ≥ 1, required

**Checkout Schema** (GET /carts/checkout/:userId):
- `userId`: string, required, trimmed

**Remove Item Schema** (DELETE /carts/items/:userId/:productId):
- `userId`: string, required, trimmed
- `productId`: string, required, trimmed

---

## Session Strategy

### Authentication Flow

1. **User Registration**
   - User submits email and password
   - Password is hashed using bcrypt with 10 salt rounds
   - User document is created in MongoDB
   - JWT token is generated and returned

2. **User Login**
   - User submits email and password
   - System retrieves user from database
   - Password is compared using bcrypt
   - On success, JWT token is issued

3. **Token Usage**
   - Token is included in request header: `Authorization: Bearer <token>`
   - Token contains: `{ id: userId, email: userEmail }`
   - Token is verified on protected routes
   - Secret key is stored in environment variables

4. **Protected Routes**
   - Cart endpoints require valid JWT token
   - Token is verified using `jwt.verify()`
   - Invalid/missing tokens return 401 Unauthorized
   - User info is attached to `req.user` object

### Token Expiration
- **Current Implementation**: No expiration set
- **Recommendation**: Add `expiresIn` option for production (e.g., "7d")

---

## Promotion Formula

### Two-Tier Discount System

The checkout summary applies two independent discount mechanisms:

#### 1. **Value-Based Discount** (Percentage)
Applied based on cart subtotal:

```
Subtotal ≥ ₹20,000  →  15% discount
Subtotal ≥ ₹10,000  →  10% discount
Subtotal ≥ ₹5,000   →  5% discount
Subtotal < ₹5,000   →  No discount
```

**Example**: Subtotal ₹12,000 → Discount = 12,000 × 0.10 = ₹1,200

#### 2. **Diversity Bonus** (Fixed Amount)
Applied based on unique product categories in cart:

```
Unique Categories ≥ 5  →  ₹1,000 bonus
Unique Categories ≥ 3  →  ₹500 bonus
Unique Categories < 3  →  No bonus
```

#### 3. **Shipping Charge**
```
finalAmount < ₹2,000  →  Add ₹100 shipping
finalAmount ≥ ₹2,000  →  Free shipping
```

#### Final Calculation
```
Total Discount = Percentage Discount + Diversity Bonus
Final Amount = Subtotal - Total Discount
If Final Amount < ₹2,000:
  Final Amount += ₹100 (shipping)
```

**Example Checkout**:
- Subtotal: ₹8,000 (electronics, clothes, groceries)
- Percentage Discount: 8,000 × 0.05 = ₹400
- Diversity Bonus: ₹500 (3 categories)
- Total Discount: ₹900
- Amount after discount: ₹7,100
- Shipping: No charge (≥ ₹2,000)
- **Final Amount: ₹7,100**

---

## Feature: Delete Item from Cart

### Overview
The **Delete Item** feature allows authenticated users to remove specific products from their shopping cart. This feature was added to provide users with complete cart management functionality.

### Why Was This Feature Added?

1. **User Experience**: Customers need the ability to remove unwanted items from their cart
2. **Cart Flexibility**: Essential for cart management alongside add and view operations
3. **Data Integrity**: Proper removal ensures accurate checkout calculations
4. **Complete CRUD**: Completes the cart management lifecycle (Create/Add, Read/View, Delete/Remove)

### Implementation Details

#### Route
```
DELETE /carts/items/{userId}/{productId}
```

#### Authentication
- Requires valid JWT Bearer token
- Token must contain user ID and email

#### Request Parameters
| Parameter | Type | Location | Description |
|-----------|------|----------|-------------|
| userId | string | path | The ID of the user whose cart item will be removed |
| productId | string | path | The ID of the product to remove from the cart |
| Authorization | string | header | Bearer JWT token |

#### Validation
- Both `userId` and `productId` are trimmed and validated as required strings
- Validated using `removeItemSchema` in Joi

#### Processing Logic
1. Retrieve cart from database by `userId`
2. Validate cart exists (404 if not found)
3. Find item in cart by `productId`
4. Validate item exists (404 if not found)
5. Remove item from cart using `splice()`
6. Save updated cart to database
7. Return remaining items and success message

#### Response Structure
```json
{
  "success": true,
  "message": "Item removed from cart.",
  "data": {
    "userId": "641a98c12b4f1f0012345678",
    "productId": "prod-001",
    "items": [
      {
        "productId": "prod-002",
        "productName": "USB Cable",
        "category": "electronics",
        "price": 12.99,
        "quantity": 1
      }
    ]
  }
}
```

#### Error Handling
| Status | Message | Cause |
|--------|---------|-------|
| 401 | No token provided | Missing or invalid JWT token |
| 400 | Validation error | Invalid userId or productId format |
| 404 | Cart not found | User has no cart |
| 404 | Item not found in cart | Product doesn't exist in user's cart |
| 500 | Server error | Database or other internal error |

#### Practical Usage Examples

**Example 1: Remove Single Item**
```bash
curl -X DELETE http://localhost:8000/carts/items/641a98c12b4f1f0012345678/prod-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example 2: Remove Item with Postman**
- Method: DELETE
- URL: `http://localhost:8000/carts/items/641a98c12b4f1f0012345678/prod-001`
- Headers: `Authorization: Bearer <your_token>`
- Response: Updated cart with remaining items

#### Impact on Checkout
When an item is removed:
- Cart is immediately updated in database
- Future checkout calls will exclude the removed item
- Discount calculations recalculate based on remaining items and categories

---

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation message"
    }
  ]
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Resource created successfully
- **400**: Bad request / Validation error
- **401**: Unauthorized (missing/invalid token)
- **404**: Resource not found
- **500**: Server error

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/ecommercart

# JWT
SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
```

---

## API Documentation

Access the interactive Swagger UI at:
```
http://localhost:8000/api/docs
```

This provides a visual interface to test all endpoints with real-time request/response examples.

---

## Health Check Endpoint

```
GET /health
```

**Response**:
```json
{
  "success": true,
  "message": "status : OK! running..."
}
```

---

## Development Tips

1. **Testing Endpoints**: Use Swagger UI or Postman
2. **JWT Token**: Copy token from register/login response and use in Authorization header
3. **Sample Testing Flow**:
   - Register user
   - Copy token from response
   - Add items to cart with token
   - View checkout summary
   - Remove items if needed
   - Observe discount calculations

---

## Support

For issues or questions, refer to:
- API Documentation: `/api/docs`
- Console logs for debugging
- MongoDB connection string validation

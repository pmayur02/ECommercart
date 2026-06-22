# DESIGN.md - Architecture

## Architecture Overview

```
┌─────────────────────────────────────┐
│     Express HTTP Server             │
│         (Port 8000)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Router Layer                 │
│  (cartRoutes, userRoutes)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Middleware Layer                   │
│  - Authentication (JWT)             │
│  - Validation (Joi)                 │               
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Controller Layer                  │
│  - userController                   │
│  - cartController                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Business Logic Layer (Services)   │
│  - userService                      │
│  - cartService                      │
│  - promotionEngine                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Access Layer (Models)        │
│  - User Model                       │
│  - Cart Model                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Database Layer                    │
│        (MongoDB)                    │
└─────────────────────────────────────┘
```

### Design Pattern: MVC (Model-View-Controller)

- **Models**: Mongoose schemas defining database structure
- **Views**: JSON responses via controllers
- **Controllers**: Route handlers managing request/response flow
- **Services**: Business logic encapsulation

---

## Directory Structure

```
ECommercart/
├── connection/
│   └── db.js                    # MongoDB connection logic
├── controller/
│   ├── cartController.js        # Cart endpoint handlers
│   └── userController.js        # User endpoint handlers
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   ├── errorMiddleware.js       # Error handling
│   └── validationMiddleware.js  # Joi validation
├── models/
│   ├── cart.js                  # Cart schema & model
│   └── user.js                  # User schema & model
├── router/
│   ├── cartRoutes.js            # Cart route definitions
│   ├── userRoutes.js            # User route definitions
│   └── index.js                 # Router aggregation
├── services/
│   ├── cartService.js           # Cart business logic
│   ├── userService.js           # User business logic
│   └── campaignService.js       # (unused, for future)
├── utilities/
│   ├── constants.js             # App constants
│   ├── promotionEngine.js       # Discount calculations
│   ├── utils.js                 # Helpers (token, response)
│   └── validation.js            # Joi schema definitions
├── index.js                     # Server entry point
├── swagger.json                 # OpenAPI documentation
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── README.md                    # User documentation
```

---

## Schema Design Decisions

### 1. User Schema

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated
  name: String,               // User's full name
  email: String,              // Unique identifier
  password: String,           // Hashed with bcrypt
  status: String,             // soft delete flag
  createdAt: Date,            // Auto-set by Mongoose
  updatedAt: Date             // Auto-set by Mongoose
}
```


### 2. Cart Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  items: [{
    productId: String,        // Unique product identifier
    productName: String,      // For display purposes
    category: String,         // For promotion calculations
    price: Number,           // Snapshot of price at add time
    quantity: Number         // How many of this product
  }],
  createdAt: Date,
  updatedAt: Date
}
```


## Validation Strategy

### Multi-Layer Validation Architecture

```
┌─────────────────────────────────────┐
│   1. Route Parameter Validation     │
│   (Joi schema in middleware)        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   2. Request Body Validation        │
│   (Joi schema in middleware)        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   3. Database Constraints           │
│   (Mongoose schema validation)      │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   4. Business Logic Validation      │
│   (Service layer checks)            │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   5. Response Validation            │
│   (Error standardization)           │
└─────────────────────────────────────┘
```
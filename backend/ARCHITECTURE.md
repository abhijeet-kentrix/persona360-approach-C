# Architecture Overview

## Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Frontend)                        │
│                    React/Vue/Angular/etc.                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │ (JWT + CSRF Tokens)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Flask Application                        │
│                           (app.py)                               │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ Routes to Blueprints
                             ▼
          ┌──────────────────┴──────────────────┐
          │                                     │
          ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│   Authentication    │              │    Middleware       │
│      (Decorators)   │◄─────────────┤   (auth.py)         │
└─────────────────────┘              └─────────────────────┘
          │
          │ Validates JWT + CSRF
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Route Blueprints                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Routes  │  │ User Routes  │  │Preset Routes │         │
│  │              │  │              │  │              │         │
│  │ /api/auth/*  │  │ /api/users/* │  │/api/presets/*│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │Audience Rts  │                                               │
│  │              │                                               │
│  │ /api/build-* │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
          │
          │ Business Logic
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Service Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Utility Functions                            │  │
│  │  • Password Hashing (bcrypt)                             │  │
│  │  • Token Generation                                       │  │
│  │  • Validation Helpers                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Audience Segmentation Logic                       │  │
│  │  • Inclusion/Exclusion Processing                        │  │
│  │  • Filter Building                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │
          │ Database Operations
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer (db.py)                      │
│                       psycopg3 Connection                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Users Table  │  │Presets Table│  │Other Tables │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Authentication Flow

```
1. User Login Request
   │
   ├──► POST /api/auth/login
   │    └──► Validates credentials
   │         └──► Generates JWT token
   │              └──► Sets httponly cookie
   │                   └──► Returns user info
   │
2. Protected Request
   │
   ├──► Any protected endpoint
   │    └──► @token_required decorator
   │         ├──► Extracts JWT from cookie
   │         ├──► Validates CSRF token
   │         ├──► Decodes JWT
   │         └──► Injects user info into route
   │
3. User Logout
   │
   └──► POST /api/auth/logout
        └──► Clears cookies
             └──► Returns success
```

### Data Flow Example: Create Preset

```
Client Request
    │
    │ POST /api/presets
    │ Headers: X-CSRF-TOKEN
    │ Body: { preset_name, preset_filter_json }
    │
    ▼
Flask Router
    │
    ▼
@token_required Middleware
    │
    ├──► Validate JWT token
    ├──► Validate CSRF token
    └──► Extract user info
    │
    ▼
preset_routes.create_preset()
    │
    ├──► Validate request data
    ├──► Check for duplicates
    │
    ▼
Database Layer (db.py)
    │
    ├──► get_db_connection()
    └──► Execute INSERT query
    │
    ▼
PostgreSQL Database
    │
    └──► Returns new preset
    │
    ▼
Response to Client
    └──► JSON: { message, preset }
```

## Module Dependencies

```
app.py
 ├── config.py
 ├── routes/
 │   ├── auth_routes.py
 │   │   ├── db.py
 │   │   ├── utils/auth_utils.py
 │   │   └── middleware/auth.py
 │   ├── user_routes.py
 │   │   ├── db.py
 │   │   ├── utils/auth_utils.py
 │   │   └── middleware/auth.py
 │   ├── preset_routes.py
 │   │   ├── db.py
 │   │   └── middleware/auth.py
 │   └── audience_routes.py
 │       ├── middleware/auth.py
 │       └── InclusionExclusionLogic.py
 └── flask_cors

middleware/auth.py
 ├── jwt
 └── flask (current_app, request, jsonify)

utils/auth_utils.py
 └── bcrypt

db.py
 ├── psycopg
 └── os (environment variables)
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Layers                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: CORS Protection                                        │
│  ├──► Validates origin                                          │
│  └──► Supports credentials                                      │
│                                                                  │
│  Layer 2: JWT Authentication                                     │
│  ├──► Token stored in httponly cookie                           │
│  ├──► Signed with SECRET_KEY                                    │
│  ├──► Includes expiration (8 hours)                             │
│  └──► Cannot be accessed by JavaScript                          │
│                                                                  │
│  Layer 3: CSRF Protection                                        │
│  ├──► CSRF token in separate cookie                             │
│  ├──► Must match X-CSRF-TOKEN header                            │
│  └──► Prevents cross-site request forgery                       │
│                                                                  │
│  Layer 4: Password Security                                      │
│  ├──► Bcrypt hashing                                            │
│  ├──► Salt generation                                            │
│  └──► Slow hash computation                                     │
│                                                                  │
│  Layer 5: SQL Injection Prevention                               │
│  ├──► Parameterized queries                                     │
│  └──► No string concatenation                                   │
│                                                                  │
│  Layer 6: Role-Based Access Control                              │
│  ├──► @admin_required decorator                                 │
│  ├──► Role validation in JWT                                    │
│  └──► Company-based data isolation                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration Management

```
Environment Variables (.env)
    │
    ▼
config.py
    │
    ├──► DevelopmentConfig
    │    ├── DEBUG = True
    │    ├── COOKIE_SECURE = False
    │    └── JWT_EXPIRATION = 8 hours
    │
    ├──► ProductionConfig
    │    ├── DEBUG = False
    │    ├── COOKIE_SECURE = True
    │    └── JWT_EXPIRATION = 8 hours
    │
    └──► TestingConfig
         ├── TESTING = True
         └── ...
    │
    ▼
app.py (create_app)
    │
    └──► app.config.from_object(config[env])
```

## Scalability Considerations

### Horizontal Scaling
```
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴────┬────────┬────────┐
   │        │        │        │
   ▼        ▼        ▼        ▼
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│App 1│  │App 2│  │App 3│  │App N│
└──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
   │        │        │        │
   └────────┴────────┴────────┘
              │
              ▼
      ┌──────────────┐
      │  PostgreSQL  │
      └──────────────┘
```

### Caching Layer (Future)
```
Client Request
    │
    ▼
Flask App
    │
    ├──► Check Redis Cache
    │    ├──► Cache Hit → Return cached data
    │    └──► Cache Miss ↓
    │
    ▼
Database Query
    │
    └──► Store in Redis Cache
         └──► Return data
```

### Microservices Evolution (Future)
```
Current: Monolithic Flask App

Future: Microservices
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Auth Service  │  │User Service  │  │Preset Service│
└──────────────┘  └──────────────┘  └──────────────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                   ┌──────▼──────┐
                   │ API Gateway  │
                   └──────────────┘
```

## Design Patterns Used

1. **Application Factory Pattern** (`create_app()`)
   - Allows multiple app instances
   - Enables testing with different configs

2. **Blueprint Pattern** (Route organization)
   - Modular route organization
   - Easy to add/remove features

3. **Decorator Pattern** (Middleware)
   - Cross-cutting concerns (auth, logging)
   - Reusable functionality

4. **Repository Pattern** (db.py)
   - Abstracts database operations
   - Single point for connection management

5. **Configuration Pattern** (config.py)
   - Environment-based configuration
   - Centralized settings management

## Performance Considerations

1. **Database Connection Pooling**
   - Currently: Connection per request
   - Future: Use connection pool (psycopg.pool)

2. **Query Optimization**
   - Use indexes on frequently queried columns
   - Limit result sets with pagination
   - Use EXPLAIN ANALYZE for slow queries

3. **Response Caching**
   - Consider Flask-Caching for static data
   - Cache preset lists, user lists

4. **Async Operations** (Future)
   - Use Flask with async/await
   - Non-blocking database operations

## Monitoring & Logging (Future Additions)

```
Application Logs
    │
    ├──► Request/Response Logging
    ├──► Error Tracking (Sentry)
    ├──► Performance Metrics (Prometheus)
    └──► User Activity Audit Trail
```

## Testing Strategy

```
Unit Tests
├── Test each route function
├── Mock database connections
├── Test utilities in isolation
└── Test middleware decorators

Integration Tests
├── Test blueprint registration
├── Test database operations
└── Test authentication flow

End-to-End Tests
└── Test complete user workflows
```

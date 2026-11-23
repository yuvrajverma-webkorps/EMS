# Employee Management System

A full-stack Employee Management System built using Java, Spring Boot, Spring Security, JWT authentication, MySQL, and Thymeleaf. The application includes user registration, login, secure API access, role-based authorization, and a web-based dashboard.

## Features

- User registration
- User login and authentication
- Password encryption using BCrypt
- JWT token generation and validation
- Stateless authentication
- Role-based authorization (USER and ADMIN)
- Protected REST APIs
- Thymeleaf-based frontend
- Login page
- Registration page
- Home dashboard
- Logout functionality
- MySQL database integration

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot | Application framework |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database operations |
| MySQL | Relational database |
| JWT (JJWT) | Token-based authentication |
| Thymeleaf | Server-side HTML rendering |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend/backend communication |
| Maven | Dependency management and build |

## Project Structure

```text
src/
├── main/
│   ├── java/
│   │   └── com/verma/yuvrajspringdemo/
│   │       ├── config/
│   │       │   └── SecurityConfig.java
│   │       ├── controller/
│   │       │   ├── AuthController.java
│   │       │   ├── PageController.java
│   │       │   └── TestController.java
│   │       ├── dto/
│   │       │   ├── LoginRequest.java
│   │       │   ├── RegisterRequest.java
│   │       │   └── AuthResponse.java
│   │       ├── model/
│   │       │   ├── AppUser.java
│   │       │   └── Role.java
│   │       ├── repository/
│   │       │   └── UserRepository.java
│   │        ├── security/
│   │        │   ├── CustomUserDetailsService.java
│   │        │   ├── JwtAuthenticationFilter.java
│   │        │   └── JwtService.java
│   │        └── YuvrajSpringDemoApplication.java
│   │
│   └── resources/
│       ├── templates/
│       │   ├── login.html
│       │   ├── register.html
│       │   └── home.html
│       ├── static/
│       │   ├── css/
│       │       └── style.css
│       │   └── js/
│       │           └── app.js
│       └── application.properties
│
├── pom.xml
└── README.md
```

## Authentication Architecture

The application uses JWT-based stateless authentication.

### Login flow

1. User submits email and password through the login page.
2. The frontend sends the credentials to the authentication API.
3. Spring Security's AuthenticationManager authenticates the user.
4. CustomUserDetailsService retrieves the user from MySQL.
5. BCrypt verifies the submitted password against the stored password hash.
6. JwtService generates a JWT token.
7. The frontend stores the token and redirects the user to the home dashboard.

### Protected API flow

1. The frontend sends an API request with the JWT token in the Authorization header.
2. JwtAuthenticationFilter extracts the token.
3. JwtService validates the token and extracts the user identity.
4. Spring Security establishes authentication in the SecurityContext.
5. Authorization rules check the user's role and permissions.
6. The request is allowed or rejected accordingly.

## Security

- Passwords are stored using BCrypt hashing.
- JWT tokens are used to authenticate API requests.
- Authentication is stateless using `SessionCreationPolicy.STATELESS`.
- CSRF protection is disabled for the stateless bearer-token API configuration.
- Authentication endpoints are publicly accessible.
- Protected endpoints require a valid JWT.
- Role-based access control supports USER and ADMIN roles.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate and receive JWT | Public |

### Test and protected APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/test/user` | Test authenticated access | USER / ADMIN |
| GET | `/api/test/admin` | Test administrator access | ADMIN |

## Frontend Pages

| Page | URL | Description |
|---|---|---|
| Login | `/login` | User login |
| Registration | `/register` | Create a new account |
| Home | `/home` | Authenticated dashboard |
| Root | `/` | Redirects to login view |

The frontend is served by Spring Boot using Thymeleaf templates. JavaScript handles authentication API calls, JWT storage, dashboard access, and logout.

## Prerequisites

Make sure the following are installed:

- JDK 21
- Maven
- MySQL Server
- IntelliJ IDEA or another Java IDE
- Postman (optional, for API testing)

## Database Configuration

Create a MySQL database for the application.

```sql
CREATE DATABASE employee_db;
```

Configure the database connection in `src/main/resources/application.properties`.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080

spring.thymeleaf.cache=false
```

Update the username and password according to your local MySQL configuration.

## JWT Configuration

The JWT configuration is defined in `application.properties`.

```properties
application.security.jwt.secret-key=${JWT_SECRET}
application.security.jwt.expiration=86400000
```

Generate a Base64 secret using:

```bash
openssl rand -base64 32
```

Set the `JWT_SECRET` environment variable before starting the application.

PowerShell:

```powershell
$env:JWT_SECRET="YOUR_GENERATED_SECRET"
```

The token expiration is configured for 24 hours.

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd YuvrajSpringDemo
```

### 3. Configure MySQL

Create the database and update the database credentials in `application.properties`.

### 4. Configure JWT secret

Generate a secret and set the `JWT_SECRET` environment variable.

### 5. Build the project

```bash
mvn clean install
```

### 6. Run the application

```bash
mvn spring-boot:run
```

The application will start on:

```text
http://localhost:8080
```

## How to Use

1. Open `http://localhost:8080/register`.
2. Create an account using your email and password.
3. Navigate to the login page.
4. Log in with your registered credentials.
5. The application generates a JWT token.
6. The user is redirected to the home dashboard.
7. The dashboard calls a protected API using the JWT.
8. Authentication status is displayed.
9. Click Logout to clear the token and return to login.

## Testing APIs with Postman

### Register

```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json
```

```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

### Login

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json
```

```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

The response contains the JWT token.

### Access protected endpoint

```http
GET http://localhost:8080/api/test/user
Authorization: Bearer YOUR_JWT_TOKEN
```

Expected response:

```text
Welcome! You are authenticated.
```

## Authorization

The application supports two roles:

| Role | Permissions |
|---|---|
| USER | Access authenticated user endpoints |
| ADMIN | Access user endpoints and administrator endpoints |

A user with the USER role cannot access endpoints restricted to ADMIN.

## Current Project Status

### Implemented

- Spring Boot application setup
- MySQL connectivity
- User entity and role model
- User repository
- Custom UserDetailsService
- Spring Security configuration
- BCrypt password encoding
- JWT generation
- JWT validation
- JWT authentication filter
- Registration API
- Login API
- Role-based access rules
- Login frontend
- Registration frontend
- Home dashboard
- Logout
- Frontend API integration

### Planned Enhancements

- Employee CRUD functionality
- Employee listing page
- Add employee form
- Edit employee details
- Delete employee functionality
- Search and filter employees
- Admin dashboard
- Better validation and error handling
- Improved responsive UI
- Production security improvements

## Security Note

This project is currently intended for learning and local development. Before production deployment, implement appropriate HTTPS, secure token handling, CORS configuration, rate limiting, stronger session/token protection, and centralized exception handling.

---

**Author:** Yuvraj

**Project:** Employee Management System

**Status:** Development

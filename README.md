# Employee Management System

A Spring Boot application for managing employees with JWT-based
authentication, role-based authorization, and a web UI served by the
same Java application.

## Features

-   User registration and login
-   JWT authentication and role-based access (`USER`, `ADMIN`)
-   Thymeleaf login, registration, and dashboard pages
-   Employee CRUD: create, list, view by ID, update, and delete
-   MySQL persistence using Spring Data JPA
-   Responsive UI with HTML, CSS, and JavaScript

## Tech Stack

-   Java 21, Spring Boot
-   Spring Security, JWT (JJWT), BCrypt
-   Spring Data JPA / Hibernate
-   MySQL
-   Thymeleaf, HTML, CSS, JavaScript
-   Maven

## Project Structure

``` text
src/main/java/com/verma/yuvrajspringdemo/
├── config/          # Security configuration
├── controller/      # Page, authentication, and employee APIs
├── dto/             # Request/response objects
├── model/           # Employee, AppUser, Role
├── repository/       # Spring Data repositories
└── security/        # JWT service, filter, user-details service

src/main/resources/
├── templates/       # login.html, register.html, home.html
└── static/
    ├── css/        # styles
    └── js/         # frontend logic
```

## API Endpoints

### Authentication

Method   Endpoint               Description
  -------- ---------------------- -----------------------
POST     `/api/auth/register`   Register a user
POST     `/api/auth/login`      Login and receive JWT

### Employees (JWT required)

Method   Endpoint                Description
  -------- ----------------------- --------------------
POST     `/api/employees`        Create employee
GET      `/api/employees`        List employees
GET      `/api/employees/{id}`   Get employee by ID
PUT      `/api/employees/{id}`   Update employee
DELETE   `/api/employees/{id}`   Delete employee

### Pages

URL               Page
  ----------------- --------------------
`/` or `/login`   Login
`/register`       Registration
`/home`           Employee dashboard

## Configuration

Configure your MySQL database and JWT secret in
`src/main/resources/application.properties` or through environment
variables. Example settings:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

application.security.jwt.secret-key=${JWT_SECRET}
application.security.jwt.expiration=86400000

spring.thymeleaf.cache=false
```

Set a strong Base64-encoded JWT secret in your environment before
running the application. Do not commit real credentials or secrets.

## Run Locally

Prerequisites: JDK 21, Maven, and MySQL.

1.  Create the database:

    ``` sql
    CREATE DATABASE employee_db;
    ```

2.  Configure database credentials and `JWT_SECRET`.

3.  Start the application:

    ``` bash
    mvn spring-boot:run
    ```

4.  Open `http://localhost:8080` in your browser and register/login.

Build the project:

``` bash
mvn clean install
```

## Security Notes

Employee APIs require a valid JWT. Registration creates a `USER` role by
default. Keep secrets out of source control. This is a learning project;
review token storage and validation, input validation, and error
handling before production use.

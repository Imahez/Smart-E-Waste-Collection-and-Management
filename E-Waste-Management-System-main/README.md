# EcoWaste Management System - Smart e-Waste Collection

A comprehensive full-stack solution for efficient electronic waste management, featuring a React-based frontend and a Spring Boot backend. The system facilitates e-waste collection, request tracking, and provides administrative oversight.

## 🚀 Key Features

- **User Dashboard**: Register, login, and submit e-waste pickup requests with image uploads and location details.
- **Admin Panel**: Manage user accounts, role assignments, and oversee all pickup requests.
- **Pickup Personnel Interface**: Manage and update assigned collection tasks.
- **AI Chatbot**: Intelligent assistant for answering user queries regarding e-waste disposal and system usage.
- **Certificate Generation**: Automated generation of disposal certificates for users.
- **Data Visualization**: Interactive dashboards using Recharts for e-waste statistics.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management/API**: Axios, React Router
- **Visualization**: Recharts, Three.js (for 3D elements)
- **AI Integration**: Google Generative AI / OpenAI

### Backend
- **Framework**: [Spring Boot](https://spring.io/projects/spring-boot) (Java 17)
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Gradle
- **Email**: Spring Mail (SMTP integration)

## ⚙️ Project Structure

```text
EcoWaste/
├── E-Waste-Management-System-main/
│   ├── frontend/          # React application (Vite)
│   │   ├── src/           # Components, Pages, Assets
│   │   ├── public/        # Static assets
│   │   └── package.json   # Dependencies and scripts
│   └── backend/           # Spring Boot application
│       ├── ewaste/        # Source code, Gradle build
│       └── uploads/       # Storage for uploaded images
```

## 🛠️ Setup & Installation

### Prerequisites
- **Java 17** or higher
- **Node.js** (LTS) & **npm**
- **MySQL Server**

### 1. Database Configuration
1. Create a MySQL database named `ecowaste_db`:
   ```sql
   CREATE DATABASE ecowaste_db;
   ```
2. Update the credentials in `backend/ewaste/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/ewaste
   ```
2. Run the Spring Boot application using Gradle:
   ```bash
   ./gradlew bootRun
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security & Configuration
- **JWT**: Token-based authentication for secure API access.
- **CORS**: Configured to allow communication between frontend and backend.
- **File Uploads**: Configured to handle up to 50MB per file for high-res e-waste images.

## 📧 Support
For queries, users can use the integrated AI Chatbot or submit a Support Query via the dashboard.

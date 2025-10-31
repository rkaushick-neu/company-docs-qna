# Company RAG Chat Application

A sophisticated Retrieval-Augmented Generation (RAG) chat application designed for company knowledge management. This application allows employees to query company documents through an intelligent AI-powered chat interface, with department-specific access controls and secure authentication.

## Features

### Core Features
- **Secure Authentication**: Employee login with department-based access control
- **Department-Specific Knowledge Access**: Users can only access documents relevant to their department
- **AI-Powered Chat Interface**: Intelligent responses using Google Gemini 2.5 Pro with context from company documents
- **Hybrid Search**: Combines semantic and BM25 search for accurate document retrieval
- **Memory Support**: Maintains conversation context using LangChain memory buffers
- **Modern UI**: Beautiful, responsive interface with frosted glass design and gradient backgrounds
- **Real-time Chat**: Instant responses with loading states and error handling

### Technical Features
- **Vector Database Integration**: Uses Qdrant for efficient document storage and retrieval
- **OpenAI Embeddings**: Text embeddings using OpenAI's text-embedding-3-small model
- **Workflow Automation**: n8n workflows for login validation and chat processing
- **PostgreSQL Integration**: Secure user credential storage with password hashing
- **Evaluation System**: Built-in response quality evaluation using Google Sheets integration

## Architecture

The application consists of three main components:

1. **Frontend** (React + TypeScript + Vite)
   - Modern React application with Tailwind CSS
   - Secure login interface with password hashing
   - Real-time chat interface with markdown rendering

2. **Backend** (FastAPI)
   - RESTful API endpoints for authentication and chat
   - CORS-enabled for frontend communication
   - Proxy to n8n workflows for business logic

3. **n8n Workflows**
   - Login validation workflow with PostgreSQL integration
   - RAG chat workflow with Qdrant vector database
   - Evaluation and logging workflows

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- n8n instance (cloud or self-hosted)
- PostgreSQL database
- Qdrant vector database
- OpenAI API key
- Google Gemini API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rkaushick-neu/company-docs-qna
cd company-docs-qna
```

### 2. Backend Setup

The backend uses **uv** (a modern, fast Python package manager) for dependency management and environment handling.

#### Install uv

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Run the Backend

```bash
cd backend
uv sync  # Installs dependencies based on pyproject.toml and uv.lock
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

Environment variables (like N8N webhook URLs and API keys) are loaded automatically from your `.env` file.  
`python-dotenv` is installed via uv dependencies, so configuration via `.env` works out of the box.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. n8n Workflow Setup

#### Importing Workflows

1. **Login to your n8n instance**
2. **Import the following workflows** from the `n8n/` directory:
   - `Login_Validate.json` - Handles user authentication
   - `Company Knowledge Base RAG.json` - Main chat workflow
   - `Error Logs.json` - Error logging (optional)
   - `File Triggers.json` - File processing triggers (optional)
   - `Insert MAIN.json` - Data insertion workflow (optional)

#### Setting up Credentials

You'll need to configure the following credentials in your n8n instance:

1. **PostgreSQL Connection**
   - Database: Your company database
   - Tables: `userCredentials` and `ragEmployees`

2. **Qdrant Vector Database**
   - Collection: `company_knowledge_base`
   - Embedding model: OpenAI text-embedding-3-small

3. **OpenAI API**
   - API Key: Your OpenAI API key
   - Models: text-embedding-3-small, gpt-4.1-mini

4. **Google Gemini API**
   - API Key: Your Google Gemini API key
   - Model: gemini-2.5-pro

5. **Google Sheets** (for evaluation)
   - OAuth2 credentials for evaluation logging

#### Workflow Configuration

1. **Set up Environment Variables**
   - Copy the example environment file:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Then open `.env` and fill in your actual credentials and webhook URLs for your n8n instance.

2. **Configure Database Schema**:
   ```sql
   -- Create user credentials table
   CREATE TABLE userCredentials (
       employeeId INTEGER PRIMARY KEY,
       passwordHash TEXT NOT NULL
   );

   -- Create employees table
   CREATE TABLE ragEmployees (
       id INTEGER PRIMARY KEY,
       fullName TEXT NOT NULL,
       department TEXT NOT NULL,
       status BOOLEAN DEFAULT TRUE
   );
   ```

3. **Set up Qdrant Collection**:
   - Create collection named `company_knowledge_base`
   - Configure with OpenAI embeddings
   - Upload your company documents with proper metadata

## Configuration

### Frontend Configuration

Update the API base URL in `frontend/src/types/index.ts`:

```typescript
export const API_BASE = "http://localhost:8000";
```

## Usage

### 1. Employee Login

- Navigate to the login page
- Enter your Employee ID and password
- The system will validate credentials against the PostgreSQL database
- Upon successful login, you'll be redirected to the chat interface

### 2. Chat Interface

- Ask questions about company documents
- The system will search through documents relevant to your department
- Responses include source citations with clickable links
- Conversation history is maintained throughout the session

### 3. Document Access

- Users can only access documents from their department
- The system uses hybrid search (semantic + BM25) for accurate results
- Responses are generated using Google Gemini 2.5 Pro with document context

## Security Features

- **Password Hashing**: Uses PostgreSQL's `crypt()` function for secure password storage
- **Department Isolation**: Users can only access documents from their assigned department
- **CORS Protection**: Backend configured with appropriate CORS settings
- **Input Validation**: All user inputs are validated and sanitized

## Testing

### Mock Data

The application includes mock employee data for testing:
- Employee ID: `1001` - Department: `Managed Returns`
- Employee ID: `1002` - Department: `AvaTax`

### Evaluation System

The n8n workflows include an evaluation system that:
- Tests responses against ground truth data
- Logs results to Google Sheets
- Provides quality metrics for continuous improvement

## Deployment

### Production Deployment

1. **Backend**: Deploy FastAPI application using Gunicorn or similar
2. **Frontend**: Build and deploy static files using `npm run build`
3. **n8n**: Use n8n cloud or deploy self-hosted instance
4. **Database**: Set up production PostgreSQL and Qdrant instances

### Docker Deployment (Optional)

Create `Dockerfile` and `docker-compose.yml` for containerized deployment:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/company_rag
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=company_rag
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## API Documentation

### Authentication Endpoint

```http
POST /api/login
Content-Type: application/json

{
  "username": "employee_id",
  "hashed_password": "password"
}
```

### Chat Endpoint

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Your question",
  "department": "Department Name",
  "employeeId": "employee_id"
}
```

### Health Check

```http
GET /api/health
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the n8n workflow documentation
- Review the API endpoints in the backend
- Check the browser console for frontend errors
- Verify all credentials are properly configured

## Updates

To update the application:
1. Pull the latest changes from the repository
2. Update dependencies in both frontend and backend
3. Import updated n8n workflows if any changes were made
4. Test the application thoroughly before deploying

---

**Note**: This application is designed for internal company use. Ensure all API keys and database credentials are kept secure and not committed to version control.

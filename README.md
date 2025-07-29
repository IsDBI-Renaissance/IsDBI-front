# Islamic Finance AI Assistant Frontend

## Project Overview
The frontend application for the Islamic Finance AI Assistant, built with Next.js. This application provides a modern, responsive interface for users to interact with Islamic Finance AI services. It handles user authentication, chat interactions, and file uploads, routing them to the appropriate backend services.

## Tech Stack
- **Framework**: Next.js 13+ (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: JWT Token-based
- **UI Components**: Custom components with Tailwind
- **File Handling**: FormData API
- **Animation**: Framer Motion
- **Markdown Rendering**: ReactMarkdown
- **Icons**: Lucide React

## Features

### Authentication & Security
- JWT-based authentication
- Secure token storage in HTTP-only cookies
- Protected routes
- Automatic token refresh handling
- Session management

### Chat Interface
- Real-time message updates
- Support for text messages and file uploads
- Message history with search functionality
- Animated responses
- Markdown support for formatted text

### File Handling
- Drag-and-drop file upload
- Progress tracking
- Multiple file support
- File type validation
- Automatic file removal after upload

### Service Integration
The frontend integrates with four specialized AI services:
1. **Service 1**: Use Case Scenario
2. **Service 2**: Reverse Transactions
3. **Service 3**: Standards Enhancements
4. **Service 4**: Team Own Category

## Folder Structure

```
isdb-front/
├── app/                   # Next.js app directory
│   ├── dashboard/        # Main dashboard
│   ├── login/           # Authentication pages
│   └── signup/
├── components/          # Reusable components
│   ├── chat/           # Chat-related components
│   │   ├── chat-container.tsx
│   │   ├── file-upload.tsx
│   │   ├── header-dropdown.tsx
│   │   └── sidebar.tsx
│   └── ui/             # UI components
├── contexts/           # React contexts
│   └── auth-context.tsx
└── public/            # Static assets
```

## How to Run

### Prerequisites
- Node.js 16+
- npm or yarn

### Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/isdb.git
   cd isdb/isdb-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## Component Structure

### Main Components
- **Dashboard**: Main application interface
- **ChatContainer**: Handles message display and input
- **FileUpload**: Manages file uploads
- **HeaderDropdown**: Service selection
- **Sidebar**: Navigation and history

### Context Providers
- **AuthContext**: Manages authentication state
- **ThemeContext**: Handles dark/light mode

## API Integration

### Authentication Endpoints
```typescript
// Login
POST /auth/login
Body: { email: string, password: string }

// Register
POST /auth/register
Body: { name: string, email: string, password: string }
```

### Service Endpoints
```typescript
// Text Message
POST /gateway/{serviceId}
Headers: {
  Authorization: Bearer <token>,
  Content-Type: multipart/form-data
}
Body: {
  text: string
}

// File Upload
POST /gateway/{serviceId}
Headers: {
  Authorization: Bearer <token>,
  Content-Type: multipart/form-data
}
Body: {
  file: File
}
```

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`
4. Deploy

### Environment Variables
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL

## Known Issues

1. **Input Limitations**
   - Only one input type (text or file) can be sent per request
   - File size limits may apply

2. **Token Handling**
   - JWT tokens expire after 1 hour
   - Users need to re-login after token expiration

3. **Service Routing**
   - Service IDs must match exactly
   - Default routing to service1 if topic not found

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Author
LARIBI ABDERRAHIM

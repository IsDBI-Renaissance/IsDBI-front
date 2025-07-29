# API Documentation

## Base URL
```
${NEXT_PUBLIC_BACKEND_URL}/gateway
```
Note: The base URL is defined by the `NEXT_PUBLIC_BACKEND_URL` environment variable, which defaults to `http://localhost:3000`.

## Authentication
All API endpoints require authentication using a JWT token. The token should be included in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### 1. Use Case Scenario Analysis
**Endpoint:** `/service1`  
**Method:** POST  
**Content-Type:** multipart/form-data  
**Description:** Analyzes use case scenarios and provides accounting guidance based on AAOIFI standards.

**Request Body:**
- `text` (string): The use case scenario description
- `file` (optional, file): Supporting document (PDF, DOCX, XLSX)

**Response:**
```json
{
  "analysis": "Detailed analysis of the use case",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "standards": ["FAS 1", "FAS 2"],
  "journal_entries": [
    {
      "account": "Account Name",
      "debit": 1000,
      "credit": 0
    }
  ],
  "implementation_steps": [
    {
      "step": 1,
      "description": "Step description",
      "standard_reference": "FAS 1"
    }
  ]
}
```

### 2. Reverse Transaction Analysis
**Endpoint:** `/service2`  
**Method:** POST  
**Content-Type:** application/json  
**Description:** Analyzes journal entries to identify the underlying transaction type and applicable AAOIFI standards.

**Request Body:**
```json
{
  "entries": [
    {
      "account": "Account Name",
      "debit": 1000,
      "credit": 0
    }
  ],
  "description": "Optional description of the transaction"
}
```

**Response:**
```json
{
  "transaction_type": "Identified transaction type",
  "confidence_score": 0.95,
  "applicable_standards": ["FAS 1", "FAS 2"],
  "analysis": "Detailed analysis of the transaction",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "standard_compliance": {
    "compliant": true,
    "issues": [],
    "suggestions": []
  }
}
```

### 3. Standards Enhancement Analysis
**Endpoint:** `/service3`  
**Method:** POST  
**Content-Type:** multipart/form-data  
**Description:** Analyzes standards-related queries and provides guidance on AAOIFI standards enhancements.

**Request Body:**
- `text` (string): The standards-related query
- `file` (optional, file): Supporting document (PDF, DOCX, XLSX)

**Response:**
```json
{
  "analysis": "Detailed analysis of the standards query",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "applicable_standards": ["FAS 1", "FAS 2"],
  "implementation_guidance": "Guidance on implementing the standards",
  "standard_updates": [
    {
      "standard": "FAS 1",
      "update_type": "Clarification|Enhancement|New Requirement",
      "description": "Description of the update"
    }
  ]
}
```

### 4. FinFraud Shield Analysis
**Endpoint:** `/service4`  
**Method:** POST  
**Content-Type:** multipart/form-data  
**Description:** Analyzes financial fraud scenarios and provides risk assessment based on AAOIFI standards.

**Request Body:**
- `text` (string): The fraud scenario description
- `file` (optional, file): Supporting document (PDF, DOCX, XLSX)

**Response:**
```json
{
  "risk_assessment": "Detailed risk assessment",
  "risk_level": "HIGH|MEDIUM|LOW",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "applicable_standards": ["FAS 1", "FAS 2"],
  "mitigation_strategies": ["Strategy 1", "Strategy 2"],
  "compliance_issues": [
    {
      "standard": "FAS 1",
      "issue": "Description of the compliance issue",
      "severity": "HIGH|MEDIUM|LOW"
    }
  ]
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Your session has expired. Please log in again."
}
```

### 400 Bad Request
```json
{
  "message": "Invalid request format or missing required fields",
  "details": {
    "field": "Field name",
    "error": "Error description"
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while processing your request",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-03-21T10:00:00Z"
}
```

## File Upload Guidelines

### Supported File Types
- PDF (.pdf)
- Microsoft Word (.docx)
- Microsoft Excel (.xlsx)

### File Size Limits
- Maximum file size: 10MB
- Maximum number of files per request: 1

## Rate Limiting
- 100 requests per hour per user
- Rate limit headers are included in the response:
  - `X-RateLimit-Limit`: Maximum requests per hour
  - `X-RateLimit-Remaining`: Remaining requests in the current hour
  - `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Best Practices

### Request Headers
Always include the following headers:
```
Content-Type: application/json or multipart/form-data
Authorization: Bearer <your_token>
Accept: application/json
```

### Error Handling
- Implement exponential backoff for retries
- Handle rate limiting by respecting the `X-RateLimit-Remaining` header
- Log all API errors for debugging purposes

### File Upload
- Compress large files before upload
- Validate file types and sizes before sending
- Handle upload timeouts appropriately 

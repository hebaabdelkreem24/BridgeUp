# Plan: Add Delete Question Endpoint

## Objective
Implement a new endpoint to delete a question by its ID, following the existing architectural patterns in the codebase.

## Changes Required

### 1. Service Layer (`Services/questionService.js`)
- Add a new service function `deleteQuestionService` that:
  - Takes a `questionId` parameter
  - Uses the Question model to find and delete the question by ID
  - Returns the deleted question or a success indicator
  - Handles errors appropriately (throws error if question not found or on database error)

### 2. Controller Layer (`Controllers/questionController.js`)
- Add a new controller function `deleteQuestion` that:
  - Extracts `questionId` from request parameters
  - Calls the service function `deleteQuestionService`
  - Returns a success response with appropriate status code (200 OK)
  - Handles errors using try/catch and returns error responses (400, 404, 500 as appropriate)
  - Uses asyncHandler wrapper for asynchronous error handling (consistent with other controllers)

### 3. Routes Layer (`Routes/questionRoutes.js`)
- Import the new controller function
- Add a new DELETE route:
  - Path: `/questions/:questionId`
  - Middleware: `protect` and `allowOnly("admin")` (consistent with other admin-protected routes)
  - Handler: `deleteQuestion` controller function

## Pattern Adherence
- Follow the exact same structure as existing functions in each layer
- Use the same error handling patterns (try/catch in controller, asyncHandler for async operations)
- Maintain consistent response format (status, message, data)
- Use the same middleware for authentication and authorization
- Follow the same naming conventions (service functions end with "Service", controller functions are exported)

## Error Handling
- Service layer throws errors for invalid IDs or database failures
- Controller layer catches errors and sends appropriate HTTP responses:
  - 400 for bad request (invalid ID format)
  - 404 if question not found
  - 500 for internal server errors
- Use express-async-handler where appropriate (as seen in other controller functions)

## Database Operation
- Use Mongoose's `findByIdAndDelete` or `deleteOne` method to remove the question
- Return the deleted question document in the service layer for potential use

## Security
- Route protected by `protect` middleware (authentication)
- Route restricted to admin users by `allowOnly("admin")` middleware
- Validation of questionId format handled by Mongoose (throws CastError for invalid formats)

## Response Format
Success Response:
```json
{
  "status": "success",
  "message": "Question deleted successfully",
  "data": {
    // deleted question object (optional)
  }
}
```

Error Responses:
- 400: { status: "error", message: "Invalid question ID format" }
- 404: { status: "error", message: "Question not found" }
- 500: { status: "error", message: "<error message>" }
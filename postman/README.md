# Profolio Backend API Postman Collection

This directory contains Postman collection and environment files for testing the Profolio Backend API.

## Files

- `profolio-backend-api.postman_collection.json` - Postman collection with all API endpoints
- `profolio-backend-api.postman_environment.json` - Postman environment variables

## Setup

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collection and environment files into Postman:
   - Click on "Import" in the top left corner
   - Select both files or drag and drop them into the import dialog
   - Click "Import"
3. Select the "Profolio Backend API - Local" environment from the dropdown in the top right corner

## Usage

The collection is organized into folders for different API endpoints:

- **Health** - Health check endpoint
- **Authentication** - User registration, login, token refresh, and logout
- **Templates** - Template CRUD operations and template data management
- **Media** - Media upload, retrieval, and management

### Authentication Flow

1. Start by running the "Register" or "Login" request to get authentication tokens
2. The collection automatically sets the `accessToken`, `refreshToken`, and `userId` variables
3. All authenticated requests use the `accessToken` variable in the Authorization header
4. If the access token expires, use the "Refresh Token" request to get a new one

### Template Management Flow

1. Create a template using the "Create Template" request
2. The collection automatically sets the `templateId` variable
3. Use the template ID to get, update, or delete the template
4. Add sections to the template using the "Add Template Section" request
5. The collection automatically sets the `sectionId` variable
6. Use the section ID to update or delete template sections

### Media Management Flow

1. Upload media using the "Upload Media" request
   - You'll need to select a file to upload in the form data
   - Optionally associate the media with a template by providing the template ID
2. The collection automatically sets the `mediaId` variable
3. Use the media ID to get, update, or delete media
4. Associate media with a template using the "Associate Media with Template" request

## Environment Variables

- `baseUrl` - Base URL for the API (default: http://localhost:3000)
- `accessToken` - JWT access token for authentication
- `refreshToken` - JWT refresh token for getting new access tokens
- `userId` - ID of the authenticated user
- `templateId` - ID of the current template
- `sectionId` - ID of the current template section
- `mediaId` - ID of the current media

## Testing All Endpoints

To test all endpoints in sequence:

1. Run the "Register" request to create a new user
2. Run the "Create Template" request to create a new template
3. Run the "Add Template Section" request to add a section to the template
4. Run the "Upload Media" request to upload a media file
5. Run the "Associate Media with Template" request to associate the media with the template
6. Run the other GET, PUT, and DELETE requests as needed

## Notes

- The collection includes test scripts that automatically set environment variables
- Make sure the API server is running before testing the endpoints
- For file uploads, you'll need to select a file in the "Upload Media" request

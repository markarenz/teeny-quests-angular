# Teeny Quest API

- Lambda supports 2 DDB tables: games and users
- POST for creating new items
- PUT for updating items
- GET for reading specific items or a list of items
  - If an ID is provided, we retrieve a specific item
- In the application, we can use the authentication `sub` value as the ID, so we provide that. For games, we do not provide an ID on creation.
- Use the provided postman collection to test the API locally

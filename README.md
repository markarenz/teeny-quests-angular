# TeenyQuestsAngular

## Tasks

### TQ1: Initual UI & Auth

- Branch: TQ1-frontend-ui-setup-auth
- [x] Set up basic pages with Angular
- [x] Set up Tailwind and basic styling
- [x] Set up Google authentication
- [x] Add user menu, log in and logout

### TQ2: Infra and API Setup

- Branch: TQ2-API-setup
- [x] API: Create AWS elements necessary for the API: API Gateway, IAM user Policy and Role, Lambda, and Dynamo DB Tables.
- [x] API: Build out a Lambda that can handle GET, POST and PUT requests for both tables (games and users)
- [x] API: Set up a collection in Postman to test the API
- [x] API: add field-based validation to queries
- [x] API: add a query for games by userId with secondary index
- [x] Frontend: add function to create or update user records when logged in and give the user a random name
- [x] Frontend: Use user.name for profile initials
- [x] Frontend: Add title for avatar with "Logged in as"
- [x] Frontend: Replace Profile observable with user data from DDB

### TQ3: Game Editing Basics

- Branch: TQ3-Editor-Basics
- [x] Common table component
- [x] Common button component
- [x] Editor page with a list of the logged in user with links to each
- [x] New game button and modal that triggers a create API call
- [x] Simple game detail page `editor/:id` with an edit form
- [x] If the game is suspended, the status cannot change
- [x] Build lambda deploy NPM script for convenience
- [x] Form layout 2-col split
- [x] Loading animation for editor game page, bake into table with `isLoading` prop

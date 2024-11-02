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
- [ ] Common table component
- [ ] Common button component

- [ ] Frontend: For /editor page, display logged-in user's games
- [ ] Frontend: On /editor page, add a button to a basic form to create/edit game
- [ ] Frontend: One save, hit API to create/update game

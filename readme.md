# Telegram Coin Tap Backend

This is the backend server for the Telegram Coin Tap App. It provides the necessary GraphQL API for managing user data and coin balances and handles interactions with a Telegram bot.

## Features

- **Telegram Bot Integration:** Responds to `/start` commands and interacts with users via Telegram.
- **GraphQL API:** Exposes queries and mutations to manage user data and coin balances.
- **Supabase:** Used as the database for storing user information and coin balances.

## Project Structure

- `index.ts`: Initializes the Telegram bot, sets up the GraphQL server, and handles incoming messages.
- `schema.ts`: Defines the GraphQL schema and resolvers for querying and mutating user data.
- `dbConfig.ts`: Configures and exports the Supabase client for database interactions.

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v14 or later)
- Yarn or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/arshali2774/CO3_server.git
```

2. Navigate to the project directory:

```bash
cd CO3_server
```

3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a .env file in the root directory and add the following environment variables:

```bash
BOT_TOKEN=your-telegram-bot-token
SUPABASE_URL=your-supabase-url
SUPABASE_API_KEY=your-supabase-api-key
```

Replace your-telegram-bot-token, your-supabase-url, and your-supabase-api-key with your actual credentials.

2. Ensure that the Supabase table users is created with the following schema:

- `chat_id`: Integer
- `name`: String
- `coin_balance`: Integer

### Running the App Locally

To run the backend server locally:

1. Start the server:

```bash
npm start
```

2. The server will be running on http://localhost:4000.
   > [!NOTE]
   > Since the backend is deployed on Render, the first launch of the app may take around 50 seconds. If you do not see the results or encounter an error message like "Error: User data not found," please wait 1-2 minutes and try again.

## GraphQL Endpoints

### Queries

- `GET_USER`: Fetches the user data based on `chat_id`:
  ```graphql
  query GetUser($chat_id: Int!) {
    getUser(chat_id: $chat_id) {
      id
      name
      coin_balance
      chat_id
    }
  }
  ```
- `checkUserExists`: Checks if a user exists based on `chat_id`:
  ```graphql
  query CheckUserExists($chat_id: Int!) {
    checkUserExists(chat_id: $chat_id)
  }
  ```

### Mutations

- `UPDATE_COINS_MUTATION`: Updates the coin balance for the user:
  ```graphql
  mutation UpdateCoins($chat_id: Int!, $coins: Int!) {
    updateCoins(chat_id: $chat_id, coins: $coins) {
      id
      coin_balance
      chat_id
    }
  }
  ```

## How It Works

1. **Telegram Bot:** Listens for /start commands and interacts with users. It sends a welcome message and a button to open the TapMe game if the user does not exist in the database or a welcome back message if they do.
2. **GraphQL Server:** Handles GraphQL queries and mutations to fetch and update user data. The server communicates with Supabase to retrieve and modify data.
3. **Supabase:** Manages user data and coin balances.

## Technology Stack

- **Node.js**: Server-side JavaScript runtime
- **GraphQL Yoga**: For setting up the GraphQL server
- **Supabase**: For managing user data
- **TypeScript**: Ensuring type safety
- **Telegram Bot API**: For integrating with Telegram

## Future Improvements

- Add more comprehensive error handling and logging.
- Implement user authentication and authorization.
- Enhance the bot's functionality with additional commands and features.

## Contact

For any questions or clarifications, feel free to contact me at:
Email: arshaliwork@gmail.com

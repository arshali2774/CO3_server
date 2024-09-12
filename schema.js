import { createSchema } from 'graphql-yoga';
import supabase from './dbConfig.js';

export const schema = createSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String!
      coin_balance: Int!
      chat_id: Int!
    }
    type Query {
      getUser(chat_id: Int!): User
      checkUserExists(chat_id: Int!): Boolean
    }
    type Mutation {
      updateCoins(chat_id: Int!, coins: Int!): User
    }
  `,
  resolvers: {
    Query: {
      getUser: async (_, args) => {
        console.log('Fetching user with chat_id:', args.chat_id);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('chat_id', args.chat_id);

        if (error) {
          console.error('Error fetching user:', error);
          throw new Error(`Error fetching user: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.log('No user found with chat_id:', args.chat_id);
          return null;
        }

        if (data.length > 1) {
          console.warn('Multiple users found with chat_id:', args.chat_id);
          return data[0]; // Return the first user found
        }

        return data[0];
      },
      checkUserExists: async (_, args) => {
        console.log('Checking if user exists with chat_id:', args.chat_id);
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('chat_id', args.chat_id);

        if (error) {
          console.error('Error checking user existence:', error);
          return false;
        }

        return data && data.length > 0;
      },
    },
    Mutation: {
      updateCoins: async (_, args) => {
        // Update the user's coin balance
        const { data, error } = await supabase
          .from('users')
          .update({ coin_balance: args.coins })
          .eq('chat_id', args.chat_id)
          .select('*')
          .single();

        if (error) {
          console.error('Error updating coins:', error);
          throw new Error(`Error updating coins: ${error.message}`);
        }

        return data;
      },
    },
  },
});

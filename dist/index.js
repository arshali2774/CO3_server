import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';
import supabase from './dbConfig.js';
const yoga = createYoga({ schema });
const server = createServer(yoga);
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN is missing in environment variables');
}
const bot = new TelegramBot(token, {
  polling: process.env.NODE_ENV !== 'development',
});
const WEB_APP_URL = 'https://tap-me.netlify.app';
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || '';
  const lastName = msg.from?.last_name || '';
  const username = `${firstName} ${lastName}`;
  try {
    //check if user exists in db
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('chat_id', chatId)
      .single();
    if (!data) {
      // If user doesn't exist, insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ chat_id: chatId, name: username, coin_balance: 0 }]);
      if (insertError) {
        throw new Error(`Error inserting user: ${insertError.message}`);
      }
      bot.sendMessage(
        chatId,
        `Welcome, ${username}! Start tapping to earn coins!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Open TapMe Game',
                  web_app: { url: WEB_APP_URL },
                },
              ],
            ],
          },
        }
      );
    } else {
      // If user already exists, send a welcome back message
      bot.sendMessage(chatId, `Welcome back, ${username}!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open TapMe Game',
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
    }
  } catch (error) {
    console.error('Error handling /start:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});
server.listen(4000, () => {
  console.log('server is running');
});
console.log('bot is running');

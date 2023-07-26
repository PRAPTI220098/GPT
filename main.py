import requests
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

# Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you obtained from BotFather on Telegram.
BOT_TOKEN = '6222084445:AAEp3MD8bjXN3xTAzm9NVTZU593IHgUtkIY'

def gpt(msg):
    try:
        result = requests.post("https://api.voidevs.com/v1/gpt/free", json={'msg': msg}).json()
        if result['result']:
            return result['results']['answer']
        else:
            return False
    except:
        return False

def start(update, context):
    update.message.reply_text("Hello! I am your GPT bot. Send me any message, and I'll respond with an answer.")

def handle_message(update, context):
    user_msg = update.message.text
    answer = gpt(user_msg)
    if answer:
        update.message.reply_text(answer)
    else:
        update.message.reply_text("Sorry, I couldn't process your request at the moment. Please try again later.")

def main():
    updater = Updater(BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()

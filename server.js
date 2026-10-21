import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Telegraf, Markup } from 'telegraf';

dotenv.config();
const app = express();
app.use(cors({origin:'*'}));
app.use(express.json());

const users = new Map();

app.get('/', (req,res)=>res.json({status:'online', name:'Lindabet'}));

app.post('/api/auth/telegram', (req,res)=>{
  const {telegram_id, username} = req.body;
  const id = String(telegram_id||'123');
  if(!users.has(id)) users.set(id, {telegram_id:id, username, balance:1000, wallets:{trc20:'TXXX'+id, bep20:'0xXXX'+id, btc:'bc1XXX'+id, ton:'UQXXX'+id}});
  res.json(users.get(id));
});

app.get('/api/wallet/my-addresses/:id', (req,res)=>{
  const u = users.get(req.params.id);
  res.json(u?u.wallets:{trc20:'T_demo', bep20:'0x_demo', btc:'bc1_demo', ton:'UQ_demo'});
});

app.get('/api/wallet/balance/:id', (req,res)=>{
  const u = users.get(req.params.id);
  res.json({balance:u?u.balance:1000});
});

const BOT_TOKEN = process.env.BOT_TOKEN||'8925696162:AAHg5bJcAVpbd1-lDKnQyAm3LbSWejgppus';
const FRONTEND_URL = process.env.FRONTEND_URL||'https://lindabet.vercel.app';
if(BOT_TOKEN){
  const bot = new Telegraf(BOT_TOKEN);
  bot.start((ctx)=>ctx.reply('🎰 Lindabet Crypto Casino - Play now!', Markup.inlineKeyboard([[Markup.button.webApp('🚀 Play Lindabet', FRONTEND_URL)]])));
  bot.launch().then(()=>console.log('bot ok'));
}

const PORT = process.env.PORT||3000;
app.listen(PORT, ()=>console.log('running '+PORT));
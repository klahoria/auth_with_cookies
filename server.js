import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './src/config/db.js'
import Cookies from 'cookies';

// require('dotenv').config('')
import 'dotenv/config'
import router from './src/api/routes/user.routes.js';
// import { useCookies } from './src/utils/jsonToken.js';

const app = express();

app.use(cors())
app.set("PORT", process.env.PORT || 3002)
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))


// const keys = ['your-secret-key'];
// app.use((req, res, next) => {
//     useCookies(keys)
//     next();
// });

// global.useCookies = useCookies(keys)

app.use(router)

const server = http.createServer(app);

connectDB().then(() => {
    server.listen(process.env.PORT, () => { console.log('listening on PORT', app.get('PORT')) })
})
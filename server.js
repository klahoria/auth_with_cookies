import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './src/config/db.js'
import Cookies from 'cookies';
import morgan from 'morgan';

// require('dotenv').config('')
import 'dotenv/config'
import router from './src/api/routes/user.routes.js';
import productRouter from './src/api/routes/products.routes.js'
// import { useCookies } from './src/utils/jsonToken.js';

const app = express();
const logger = morgan('dev')

app.use(cors())
app.set("PORT", process.env.PORT || 3002)
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger)

// const keys = ['your-secret-key'];
// app.use((req, res, next) => {
//     useCookies(keys)
//     next();
// });

// global.useCookies = useCookies(keys)

app.use('/api/auth',router)
app.use('/api/products',productRouter)

const server = http.createServer(app);

connectDB().then(() => {
    server.listen(process.env.PORT, () => { console.log('listening on PORT', app.get('PORT')) })
})
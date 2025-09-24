import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './src/config/db.js'
import morgan from 'morgan';

// require('dotenv').config('')
import 'dotenv/config'
import router from './src/api/routes/user.routes.js';
import productRouter from './src/api/routes/products.routes.js'
import { errorHandler } from './src/middlewares/errorHandler.js';
// import { useCookies } from './src/utils/jsonToken.js';

const app = express();
const logger = morgan('dev')

app.use(cors())
app.set("PORT", process.env.PORT || 3002)
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger)

app.use(errorHandler);

app.use('/api/auth', router)
app.use('/api/products', productRouter)

const server = http.createServer(app);

connectDB().then(() => {
    server.listen(process.env.PORT, () => { console.log('listening on PORT', app.get('PORT')) })
})
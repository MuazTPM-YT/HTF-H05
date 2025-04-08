import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { logger } from './utils/logger.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Error handling
app.use(errorHandler)

// Start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        logger.info('Connected to MongoDB')

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
        })
    } catch (error) {
        logger.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

startServer() 
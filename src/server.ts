import cors from 'cors'
import express from 'express'
import { router } from './router.js'
import { errorHandlerMiddleware } from './errors/middlewares/error-handler.js'

const app = express()

app.use(cors())
app.use('/api', router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

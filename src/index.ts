import express, { Application, urlencoded } from "express";
require('./database')
import userRouter from './routers/userRouter'
import { keys } from "./keys";

const app: Application = express()

app.set('port', keys.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/user', userRouter)

app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`)
})
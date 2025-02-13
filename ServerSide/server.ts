import express from "express";
import * as dotenv  from 'dotenv';
import cookieParser from "cookie-parser";
import Limit from "./config/limiter";
import { dbConfig } from "./config/dbConfig";
import Userrouter from "./routes/useroutes";
import morgan from 'morgan';
import itemrouter from "./routes/itemroutes";
import cartRouter from "./routes/cartRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(Limit);

dbConfig();
app.use(Userrouter);
app.use(itemrouter);
app.use(cartRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
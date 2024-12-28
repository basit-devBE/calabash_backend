import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Limit from "./config/limiter";
import { dbConfig } from "./config/dbConfig";
import Userrouter from "./routes/useroutes";
import morgan from "morgan";
import itemrouter from "./routes/itemroutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use(Limit);


// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:3000", 
//   credentials: true,
// };
// app.use(cors(corsOptions));

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials: true, 
};
app.use(cors(corsOptions));


dbConfig();


app.use(Userrouter);
app.use(itemrouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

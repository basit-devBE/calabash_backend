import express from "express";
import { isLoggedIn } from "../middlewares/authmiddleware";
import { createMenu, fetchallMenu, searchMenuitem } from "../controllers/Menucontrollers";
import e from "express";
import upload from "../utils/multer";

const Menurouter = express.Router();
Menurouter.post("/create/menu", isLoggedIn as any, upload.single('file'), createMenu);
Menurouter.get("/fetch/allmenu", fetchallMenu)
Menurouter.get("/fetch/menu/", searchMenuitem)

export default Menurouter;
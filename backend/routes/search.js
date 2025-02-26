import express from "express";
import { searchAcrossCollections } from "../controller/searchController.js";


const router = express.Router();

router.post("/", searchAcrossCollections);

export default router;

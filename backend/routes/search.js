import express from "express";
import { searchAcrossCollections, searchUrl } from "../controller/searchController.js";


const router = express.Router();

router.post("/", searchAcrossCollections);
router.get("/url", searchUrl)

export default router;

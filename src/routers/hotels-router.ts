import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { showHotels, showHotelById } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken);
hotelsRouter.get("/", showHotels);
hotelsRouter.get("/:hotelId", showHotelById);

export { hotelsRouter };

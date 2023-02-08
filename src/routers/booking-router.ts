import { Router } from "express";
import { authenticateToken, validateBooking } from "@/middlewares";
import { showBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken);
bookingRouter.get("/", validateBooking, showBooking);
bookingRouter.post("/", validateBooking);
bookingRouter.put("/:bookingId", validateBooking);

export { bookingRouter };

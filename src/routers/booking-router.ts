import { Router } from "express";
import { authenticateToken, validateBooking, validateBody } from "@/middlewares";
import { bookRoom, showBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken);
bookingRouter.get("/", validateBooking, showBooking);
bookingRouter.post("/", validateBooking, validateBody(bookingSchema), bookRoom);
bookingRouter.put("/:bookingId", validateBooking);

export { bookingRouter };

import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createRemoteTicketType,
  createInPersonTicketWithoutHotel,
  createInPersonTicketWithtHotel,
  createTicket,
  createValidBooking,
  createHotel,
  createRoom,
  createFullRoom
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket doesn't include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithoutHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket wasn't payed", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 if user doesn't have a booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and bookingId and Room", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const booking = await createValidBooking(userEnrollment.userId, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        }
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket doesn't include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithoutHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket wasn't payed", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond eith status 404 if roomId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: 0 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("sould respond with status 403 if room is at capacity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createFullRoom(hotel.id);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and return bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number)
      });
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/booking/0");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket doesn't include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithoutHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if ticket wasn't payed", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 if bookingId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .put("/booking/0")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: 0 });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if roomId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const booking = await createValidBooking(userEnrollment.userId, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: 0 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("sould respond with status 403 if room is at capacity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const booking = await createValidBooking(userEnrollment.userId, room.id);

      const fullRoom = await createFullRoom(hotel.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: fullRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and return new bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInPersonTicketWithtHotel();

      await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const newRoom = await createRoom(hotel.id);

      const booking = await createValidBooking(userEnrollment.userId, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number)
      });
    });
  });
});

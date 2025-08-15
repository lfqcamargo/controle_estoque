import { FastifyInstance } from "fastify/types/instance";
import { createTempCompanyComposer } from "../controllers/user/composer/create-temp-company-composer";

export async function userRoutes(app: FastifyInstance) {
  app.post("/company", (request, reply) =>
    createTempCompanyComposer().handle(request, reply)
  );
}

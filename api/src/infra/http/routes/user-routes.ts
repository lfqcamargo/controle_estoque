import { FastifyInstance } from "fastify/types/instance";
import { container } from "tsyringe";
import { CreateTempCompanyController } from "../controllers/user/create-temp-company-controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/company", (request, reply) => {
    const controller = container.resolve(CreateTempCompanyController);
    return controller.handle(request, reply);
  });
}

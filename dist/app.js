import { ApiService } from "./services/api-service.js";
import { UsersController } from "./controllers/users-controller.js";
const apiService = new ApiService();
const usersController = new UsersController(apiService);
usersController.init();

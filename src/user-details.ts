import { ApiService } from "./services/api-service.js";
import { UserDetailsController } from "./controllers/user-details-controller.js";

const apiService = new ApiService();
const userDetailsController = new UserDetailsController(apiService);

userDetailsController.init();

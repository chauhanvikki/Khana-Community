// // import express from "express";
// // import {signup,login} from "../controllers/authController.js";
// // import authMiddleware from "../Middlewares/authMiddleware.js";

// // router.get("/dashboard", authMiddleware, dashboardController);

// // const router = express.Router();

// // router.get("/",(req,res)=>{
// //     res.send("login route");
// // })

// // router.post("/signup",signup)
// // router.post("/login",login )

// // export default router;

// // routes/authRoutes.js
// import express from 'express';
// import { registerUser, loginUser } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// export default router;

// /backend/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;

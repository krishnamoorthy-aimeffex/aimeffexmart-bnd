import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import passport from "./../config/passport";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobile   
 *             properties:
 *               name:
 *                 type: string
 *                 example: Krishnamoorthy D
 *               email:
 *                 type: string
 *                 example: krishna@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email or mobile
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: krishna@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);


// Google OAuth start
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req: any, res) => {
    try {
      // 🔐 Create SAME JWT as normal login
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      // ✅ Send token and user data as query parameters
      const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile || "",
      };

      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&user=${encodedUser}`;


      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error("❌ Google OAuth Error:", error);
      res.redirect("http://localhost:5173/login?error=oauth_failed");
    }
  }
);

export default router;


// Facebook OAuth start
// Facebook OAuth start
router.get(
  "/facebook",
  passport.authenticate("facebook")
);

// Facebook OAuth callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req: any, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      // ✅ Send token and user data as query parameters
      const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile || "",
      };

      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&user=${encodedUser}`;

      console.log("🟢 Facebook OAuth Success - Redirecting to:", redirectUrl);

      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error("❌ Facebook OAuth Error:", error);
      res.redirect("http://localhost:5173/login?error=oauth_failed");
    }
  }
);

import express, { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";

const router = express.Router();

router.post("/", requiresAuth(), (req: Request, res: Response) => {
  console.log(req);

  res.send("Hello World!");
});

export default router;

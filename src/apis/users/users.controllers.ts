import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, password: hash });

    const payload = { userId: newUser._id, username };
    const secret = process.env.JWT_SECRET!;
    const options = { expiresIn: process.env.JWT_EXPIRE };
    const token = jwt.sign(payload, secret, options as jwt.SignOptions);
    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    // if (!username || !password) {
    //   return res.status(400).json({ message: "Username already in use" });
    // }
    const user = await User.findOne({ username });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id, username: user.username };
    const secret = process.env.JWT_SECRET!;
    const options = { expiresIn: process.env.JWT_EXPIRE };
    const token = jwt.sign(payload, secret, options as jwt.SignOptions);

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};

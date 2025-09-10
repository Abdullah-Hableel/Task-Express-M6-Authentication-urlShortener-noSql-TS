import Url from "../../models/Url";
import shortid from "shortid";
import User, { UserDoc } from "../../models/User";
import { NextFunction, Request, Response } from "express";

const baseUrl = "http://localhost:8000/api/urls";

export const shorten = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // create url code
  const urlCode = shortid.generate();
  try {
    req.body.shortUrl = `${baseUrl}/${urlCode}`;
    req.body.urlCode = urlCode;
    req.body.userId = req.user!.id;
    const newUrl = await Url.create(req.body);
    await User.findByIdAndUpdate(newUrl.userId, {
      $push: { urls: newUrl._id },
    });
    res.json(newUrl);
  } catch (err) {
    next(err);
  }
};

export const redirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = await Url.findOne({ urlCode: req.user?._id });
    if (url) {
      res.redirect(url.longUrl || "");
    } else {
      res.status(404).json("No URL Found");
    }
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserDoc;
    const url = await Url.findOne({ urlCode: req.params.code });
    if (!user._id.equals(url?.userId)) {
      return next({
        status: 403,
        massage: "forbidden",
      });
    }
    if (url) {
      await Url.findByIdAndDelete(url._id);
      res.status(201).json("Deleted");
    } else {
      res.status(404).json("No URL Found");
    }
  } catch (err) {
    next(err);
  }
};

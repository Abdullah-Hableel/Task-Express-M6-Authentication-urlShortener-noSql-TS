import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("no connection");
  process.exit(1);
}

export default {
  PORT,
  MONGODB_URI,
};

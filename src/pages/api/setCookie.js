import { setCookie } from "cookies-next";

export default function handler(req, res) {
  const { userId } = req.body;
  setCookie("userId", userId, { req, res, maxAge: 2630000 });
  res.status(200).json({ message: "Cookie set" });
  console.log("userId:", userId);
  console.log("Cookie set");
}



export function handler(req, res, next) {
  if (req.path === "/api") {
    return res.end("hello");
  }
  next();
};

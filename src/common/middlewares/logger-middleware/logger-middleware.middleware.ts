import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  res.on('finish', () => {
    const reqQuery =
      Object.keys(req.query).length > 0
        ? JSON.stringify(req.query)
        : 'No query';
    const reqBody = req.body
      ? Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : 'No body'
      : 'No body';
    const reqData = {
      method: req.method,
      url: req.url,
      query: reqQuery,
      body: reqBody,
    };
    console.log(`Request: ${JSON.stringify(reqData)}`);
    console.log('Response Status:', res.statusCode);
    console.log(`Response Time: ${Date.now() - start}ms`);
  });
  next();
}

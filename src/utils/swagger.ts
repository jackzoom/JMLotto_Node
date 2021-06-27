import { Application, Response, Request } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import PackageJSON from "../../package.json";

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: process.env.NAME || "Swagger Api Documents",
      description: "API Service",
      version: PackageJSON.version || "1.0.0",
    },
    components: {
      securitySchemes: {
        AdminApiAuth: { type: "apiKey", in: "header", name: "token" },
        ClientApiAuth: { type: "apiKey", in: "header", name: "token" },
      },
    },
    servers: [
      {
        url: `${process.env.SERVER_URL}/api/v1`,
        description: process.env.NODE_ENV,
      },
    ],
  },
  apis: [
    path.join(__dirname, "../router/*.ts"),
    path.join(__dirname, "../router/*/*.ts"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Application) => {
  // prettier-ignore
  app.get('/swagger.json', function(req:Request, res:Response) {
    res.setHeader('Content-Type','application/json');
    res.send(swaggerSpec);
  });
};

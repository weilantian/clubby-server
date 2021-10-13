import express, { Application } from "express";
import cors from "cors";
import { routes } from "./routes";

export const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
// app.use(cors({
//   origin:'https://clubby.teamer.xyz'
// }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

routes(app);

try {
  app.listen(port, (): void => {
    console.log(`listening on port ${port}`);
  });
} catch (error) {
  console.error(`Error occurred: ${error}`);
}

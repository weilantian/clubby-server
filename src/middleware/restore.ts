import { Request, Response } from "express";
import { execute } from "@getvim/execute";
import { createContext } from "../context";
const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const date = new Date();
const currentDate = `${date.getFullYear()}.${
  date.getMonth() + 1
}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
const fileName = `database-backup-${currentDate}.tar`;

export default () => {
  let count = 0;
  prepareBackup();
  return (req: Request, res: Response, next: () => void) => {
    count += 1;
    console.log(count);
    if (count == 10) {
      count = 0;
      // Recover here
      restore();
    }
    next();
  };
};

const prepareBackup = () => {
  execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`).then(
    () => {
      console.log("database has been backed");
    }
  );
};

const restore = () => {
  const context = createContext();
  context.prisma.$disconnect().then(() => {
    setTimeout(() => {
      execute(`pg_restore -C -d ${database} ${fileName}`)
        .then(async () => {
          context.prisma.$connect();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  });
};

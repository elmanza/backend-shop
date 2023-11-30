import fs from "fs/promises";
import path from "path";

const DATABASE_FILE_PATH = path.join(__dirname, "../", "../", "data", "db.json");

export default class HandlerDocument{
  static obj: any = null;
  constructor(private readonly seedData: any) {
    if(HandlerDocument.obj){ return HandlerDocument.obj }
    HandlerDocument.obj = this;
  }

  private async init(): Promise<void> {
    try {
      // Do nothing, since the database is initialized
      await fs.stat(DATABASE_FILE_PATH);
    } catch {
      const file = JSON.stringify(this.seedData);
      await fs.writeFile(DATABASE_FILE_PATH, file);
    }
  }

  async read(): Promise<any>{
    await this.init();
    const file = await fs.readFile(DATABASE_FILE_PATH, "utf8");
    return JSON.parse(file);
  }


  async write(data: any): Promise<any>{
    await this.init();
    const file = JSON.stringify(data);
    await fs.writeFile(DATABASE_FILE_PATH, file);
  }
}
import Dexie from "dexie";

class MyDatabase extends Dexie {
    pages;

    constructor() {
        super("MyDatabase");
        this.version(1).stores({
            pages: "++id, title, note", // Primary key and indexed props
        });

        this.pages = this.table("pages");
    }
}

const db = new MyDatabase();
export default db;
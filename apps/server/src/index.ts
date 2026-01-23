import "dotenv/config";
import express from "express";

const app = express();

app.listen(process.env.SERVER_PORT, () => {
	console.log(`server started on ${process.env.SERVER_PORT}`);
});

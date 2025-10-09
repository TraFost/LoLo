import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import type { ApiResponse } from "shared/dist";

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Keren Kamu fauzul, bisa fizz buzz",
		success: true,
	};

	return c.json(data, { status: 200 });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export default app;

import express from "express";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// TODO: Mount route handlers
// app.use("/auth", authRouter);
// app.use("/tasks", authMiddleware, taskRouter);

app.listen(port, () => {
  console.log(`task-api listening on port ${port}`);
});

export default app;

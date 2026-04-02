import app from "./index.js";

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
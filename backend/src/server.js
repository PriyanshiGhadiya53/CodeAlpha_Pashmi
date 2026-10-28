
import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Pashmi server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });


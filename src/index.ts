import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || process.env.LOCAL_PORT;

//tirar
app.listen(3333, () => console.log("running"));

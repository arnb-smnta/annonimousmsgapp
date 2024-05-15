import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

// '?' is written to signify optional variable if the varable is present then it will have number data type

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  //void means there will no return type on return value

  if (connection.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.mongoDB_URL}/annonimousmessage` || "",
      {}
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected succesfully");
  } catch (error) {
    console.log("DB connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;
// if (connection.isConnected) should not we check if it is true then we should return I have checked the db variable it connects every time and returns true I am not sure if it ever returns false on connection db failure can you please clarify if there should be a true check although

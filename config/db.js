//mongodb+srv://root:<password>@cluster0.c2suhzl.mongodb.net/?retryWrites=true&w=majority
import mongoose, { mongo } from 'mongoose'
import dotenv from "dotenv";
const conectarDB= async()=>{
    dotenv.config();
    
    try{

        const connection= await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log("MongoDB conectado en: ",url);

    }catch(error){
        console.log("Error:",error);
        process.exit(1);
    }
}
export default conectarDB;
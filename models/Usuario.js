import mongoose from "mongoose";
import bcrypt, { genSaltSync } from "bcrypt";

// npm i bcrypt => to implement tha password HASH or password encryption
// npm i jsonwebtoken
const usuarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    token:{
        type:String
       
    },
    confirmado:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

usuarioSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next(); //Is like returnm to send to the next middleware
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);

});

usuarioSchema.methods.comprobarPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const Usuario=mongoose.model('Usuario',usuarioSchema);

export default Usuario;
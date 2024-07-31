import { request } from "express";
import mongoose, { Schema } from "mongoose";


const UserSchema=Schema({
    name:{
        type:mongoose.Schema.Types.String,
        require:true
    },
    age:{
        type:mongoose.Schema.Types.String,
        require:true
    }
})


export const User=mongoose.model('user',UserSchema)
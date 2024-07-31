import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)


const PORT=process.env.PORT || 5000
const app=express()

app.get('/',(req,res)=>{
res.sendFile(path.join(__dirname,'public/index.html'))
})
app.get('/about',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/about.html'))

})



app.listen(PORT,()=>{console.log(`Server is Running ${PORT}`);})
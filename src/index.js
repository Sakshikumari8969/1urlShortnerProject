const express=require("express")
const route=require("./routes/route")
const mongoose=require("mongoose")
const app=express()

app.use(express.json())

mongoose.connect("",
{useNewUrlParser:true})
.then(()=>{console.log("mongoDb is connected")})
.catch((err)=>{console.log(err.message)})

app.use("/",route)

app.listen(3000,(err)=>{
    if(err) return console.log(err.message)
    console.log("server is running on port : ", 3000)
})



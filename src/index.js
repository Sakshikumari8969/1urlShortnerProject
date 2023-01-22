const express=require("express")
const route=require("./routes/route")
const mongoose=require("mongoose")
const app=express()

app.use(express.json())

mongoose.connect("mongodb+srv://Sakshi:monday123@cluster0.z5dpz2x.mongodb.net/group3Database",
{useNewUrlParser:true})
.then(()=>{console.log("mongoDb is connected")})
.catch((err)=>{console.log(err.message)})

app.use("/",route)

app.listen(3000,(err)=>{
    if(err) return console.log(err.message)
    console.log("server is running on port : ", 3000)
})



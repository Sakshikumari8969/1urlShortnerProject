const urlModel=require("../model/urlModel")
const shortid = require('shortid');
 

const urlCreate= async function(req,res){
   try{let data=req.body
    let detail="https://localhost:3000/"
    let urlSh= shortid.generate()
    var savedData=detail.concat(urlSh)
    let newData={longUrl:data.longUrl,shortUrl:savedData,urlCode:urlSh}    
    let g=await urlModel.create(newData)
    res.status(201).send({status:true,data:g})
}catch(error){
    res.status(500).send({error:error.message})
}
}


 




module.exports.urlCreate=urlCreate;
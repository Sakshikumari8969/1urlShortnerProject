const urlModel=require("../model/urlModel")
//const shortUrl=require("node-url-shortener")
const shortid = require("shortid");
const axios=require("axios")

// ### POST /url/shorten
// - Create a short URL for an original url recieved in the request body.
// - The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
// - Return the shortened unique url. Refer [this](#url-shorten-response) for the response
// - Ensure the same response is returned for an original url everytime
// - Return HTTP status 400 for an invalid request


 
const urlCreate= async function(req,res){
   try{let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"empty body"})
    if(!data.longUrl) return res.status(400).send({status:false,message:"long url is missing"})
    if(data.shortUrl || data.urlCode) return res.status(400).send({message:"only long url is required"})
    data.longUrl=data.longUrl.trim()
    if(!data.longUrl.match(/^(https?:\/\/)/)) res.status(404).send({message:"not correct"})
    let isCorrectUrl
    await axios.get(data.longUrl)
    .then((res)=>{isCorrectUrl=true})
    .catch((err)=>{isCorrectUrl=false})
    if(isCorrectUrl==false) res.status(400).send({status:false,message:"not valid url"})
    let present =await urlModel.findOne({longUrl:data.longUrl}).select({_id:0,__v:0})
    if(present) return res.status(400).send({message:"shorturl already generated",data:present})
    let detail="https://localhost:3000/"
    // if(!detail) return res.status(400).send({message:"not valid baseurl"})
    let urlCode= shortid.generate()
    var savedData=detail.concat(urlCode)
    // if(!savedData) return res.status(400).send({message:"glt baat h"}
    console.log(savedData)
    let newData={longUrl:data.longUrl,shortUrl:savedData,urlCode:urlCode}
    let got=await urlModel.create(newData)
    res.status(201).send({data:got})
}catch(error){
    res.status(500).send({error:error.message})
}
}

// ### GET /:urlCode
// - Redirect to the original URL corresponding
// - Use a valid HTTP status code meant for a redirection scenario.
// - Return a suitable error for a url not found
// - Return HTTP status 400 for an invalid request

const getUrl=async function(req,res){
    try{let data=req.params.urlCode
    if(!data) return res.status(400).send({status:false,message:"nothing is there to fetch"})
    let fetch=await urlModel.findOne({urlCode:data})
    if(!fetch) return res.status(404).send({status:true,message:"url not found"})
    res.status(302).send({"Found. Redirecting to" : fetch.longUrl})
}catch(error){
    res.status(500).send({error:error.message})
}}


 




module.exports={urlCreate,getUrl}


// let present =await urlModel.findOne({longUrl:data.longUrl}).select({_id:0,__v:0})
    // if(present) return res.status(200).send({data:present}) 
    // if(!present) return res.status(404).send({status:false,message:"not found"})
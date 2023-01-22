const urlModel=require("../model/urlModel");
const shortid = require("shortid");
const axios=require("axios");
const redisClient=require("../server")
const {promisify}=require("util");

const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)            // prepare function for each command
const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient)



// ### POST /url/shorten
// - Create a short URL for an original url recieved in the request body.
// - The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
// - Return the shortened unique url. Refer [this](#url-shorten-response) for the response
// - Ensure the same response is returned for an original url everytime
// - Return HTTP status 400 for an invalid request

exports.urlCreate= async (req,res)=>{
   try{let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"empty body"})
   if(Object.values(data)=="") return res.status(400).send({message:"entry point is empty"})
    if(!data.longUrl) return res.status(400).send({status:false,message:"long url is missing"})
    if(data.shortUrl || data.urlCode) return res.status(400).send({message:"only long url is required"})
    data.longUrl=data.longUrl.trim()
    if(!data.longUrl.match(/^(https?:\/\/)/)) res.status(400).send({message:"please enter valid url"})
    let cacheData=await GET_ASYNC(`${data.longUrl}`)
    if(cacheData) return res.status(200).send({status:true,fromCache:"shortUrl already created",data:JSON.parse(cacheData)})
    let presentInDb =await urlModel.findOne({longUrl:data.longUrl}).select({_id:0,__v:0})
    if(presentInDb){
    await SETEX_ASYNC(`${data.longUrl}`,86400,JSON.stringify(presentInDb))
    return res.status(200).send({status:true,message:"shorturl already generated",data:presentInDb})
    }
    let isCorrectUrl
    await axios.get(data.longUrl)
    .then((res)=>{
        if(res.status==201||res.status==200)
        isCorrectUrl=true;
    })
    .catch((err)=>{err.message})
    if(isCorrectUrl==false) res.status(400).send({status:false,message:"not valid url"}) 
    
    let baseUrl="http://localhost:3000/"
    let urlCode= shortid.generate()
    var savedData=baseUrl.concat(urlCode)                     //baseUrl+urlCode
    // console.log(savedData)
    let newData={longUrl:data.longUrl,shortUrl:savedData,urlCode:urlCode}
    await urlModel.create(newData)
    await SETEX_ASYNC(`${data.longUrl}`,86400,JSON.stringify(newData))
    res.status(201).send({data:newData})
}catch(error){
    res.status(500).send({error:error.message})
}}


// ### GET /:urlCode
// - Redirect to the original URL corresponding
// - Use a valid HTTP status code meant for a redirection scenario.
// - Return a suitable error for a url not found
// - Return HTTP status 400 for an invalid request

exports.getUrl=async (req,res)=>{
    try{let data=req.params.urlCode
        let cacheData=await GET_ASYNC(`${data}`) 
        if(cacheData){
            let result=cacheData.replace('"','')
            console.log("from cache")
        return res.status(302).redirect(result)
        }
    let fetch=await urlModel.findOne({urlCode:data})
    if(!fetch) return res.status(404).send({status:false,message:"url not found"})
    await SETEX_ASYNC(`${data}`,86400,JSON.stringify(fetch.longUrl))
    console.log("from db")
    res.status(302).redirect(fetch.longUrl)
}catch(error){
    res.status(500).send({error:error.message})
}}



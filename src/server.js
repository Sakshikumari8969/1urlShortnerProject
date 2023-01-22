const redis=require("redis")


const redisClient=redis.createClient(
    17261,
    "redis-17261.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    {no_ready_check:true})
redisClient.auth("pZQfOsevIpsERRR9AHkRqSoBjRYx9htL",function(err){
    if(err) throw err
});
redisClient.on("connect",async ()=>{
    console.log("connected to redis.....")
});


module.exports=redisClient;

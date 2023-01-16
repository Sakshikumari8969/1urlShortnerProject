
const urlController=require("../controller/urlController")
const express = require('express');
const router = express.Router();



router.post("/url/shorten",urlController.urlCreate);


router.all("/*", (req, res) =>{
    res.status(404).send({ msg: "invalid path" })
})

module.exports=router

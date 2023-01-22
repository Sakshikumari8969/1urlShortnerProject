const express = require('express');
const router = express.Router();
const urlController=require("../controller/urlController")

router.post("/url/shorten",urlController.urlCreate);
router.get("/:urlCode",urlController.getUrl);

router.all("/*", (req, res) =>{
    res.status(404).send({ msg: "invalid path" })
})




module.exports=router

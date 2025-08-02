const express=require("express");
const{v4:uuidv4}=require("uuid");
const app=express();
const{Log,requestLogger}=require("./loggers.js");
app.use(express.json());
app.use(requestLogger);
let urlii={};
app.post("/shorturls",(req,res)=>{
    const{url,validity,shortcode}=req.body;
    if(!url){
        Log("backend","error","controller","missing url");
        return res.status(400).json({error:"url is required"});
    }
    let code=shortcode||uuidv4().slice(0,6);
    if(urlii[code]){
        Log("backend","warn","controller","shortcode already exists");
        return res.status(400).json({error:"short code already exists"});
    }
    const expiryTime=new Date(Date.now()+(validity||30)*60*1000);
    urlii[code]={
        url,
        expiry:expiryTime.toISOString(),
        createdAt:new Date().toISOString(),
        clicks:0,
        clickData:[]
    };
    Log("backend","info","controller","created");
    res.status(201).json({
        shortLink:`http://localhost:3000/${code}`,
        expiry:expiryTime.toISOString()
    });
});
app.get("/:shortcode",(req,res)=>{
    const code=req.params.shortcode;
    const data=urlii[code];
    if(!data){
        Log("backend","error","controller","short code not found");
        return res.status(404).json({error:"shortcode not found"});
    }
    if(new Date(data.expiry)<new Date()){
        delete urlii[code];
        Log("backend","warn","controller","short uro expired");
        return res.status(410).json({error:"short url expired"});
    }
    data.clicks+=1;
    data.clickData.push({
        timestamp:new Date().toISOString(),
        referrer:req.get("referer")||"direct",
        ip:req.ip
    });
    Log("backend","info","controller","redirecting");
    res.redirect(data.url);
});
app.get("/shorturls/:shortcode/stats",(req,res)=>{
    const code=req.params.shortcode;
    const data=urlii[code];
    if(!data){
        Log("backend","error","controller","invalid short code");
        return res.status(404).json({error:"shortcode not found"});
    }
    Log("backend","info","controller","stats");
    res.json({
        shortLink:`http://localhost:3000/${code}`,
        originalUrl:data.url,
        createdAt:data.createdAt,
        expiry:data.expiry,
        totalClicks:data.clicks,
        clickData:data.clickData
    });
});
app.listen(3000,()=>{console.log("server is running on port 3000");});

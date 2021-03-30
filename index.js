var express = require("express")
const CovidCall = require("./covidApiCall")
// var router = express.Router()
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.json({
        success:true,
    })
})

app.get("/covid", (req,res)=>{
    res.send("Covid api call")
})

app.listen(port, ()=>{
    console.log(`server is listening at localhost:${port}`)
    setInterval(()=>{
        CovidCall.ApiCall()
    }, 2000)
})
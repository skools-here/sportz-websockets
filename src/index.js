import express from "express" 

const app=express();
const port=8080;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello from Express Server!")
})


app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`)
})
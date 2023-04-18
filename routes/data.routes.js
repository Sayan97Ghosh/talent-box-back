const express=require("express");
const { dataModel } = require("../models/data.models");
// const { Authentication } = require("../middlewares/authentication");


const dataRoute=express.Router();



//adding new course data
dataRoute.post("/",async(req,res)=>{
    const dataArray = req.body.data;

    // Validate input
    if (!dataArray || !Array.isArray(dataArray)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    // Save data to database
    dataModel.insertMany(dataArray)
      .then(() => res.status(201).json({ success: true }))
      .catch(err => res.status(500).json({ error: err.message }));
})

//Getting Courses Details

dataRoute.get("/",async(req,res)=>{
    // const {page}=req.body;
    // const skipdata=(page-1)*4   
    // .skip(skipdata||0).limit(4)            //data to be skip
    const blog=req.params
    try{
        const blogData=await dataModel.find(blog)   //pagination
        res.status(200).send(blogData)      //sending blogs data

    }catch(err){
        res.status(404).send({msg:err.message})
    }
})

// single course by id

// dataRoute.get("/:_id",async(req,res)=>{

//     const blog=req.params
//     try{
//         const blogData=await dataModel.findOne({_id:blog._id})
//         res.status(200).send(blogData)      //sending blogs data

//     }catch(err){
//         res.status(404).send({msg:err.message})
//     }
// })


//updating blog



// Deleting Blog 

dataRoute.delete("/:blogid",async(req,res)=>{
    const blog=req.params.blogid;
    // const userid=req.body.userid
    try{
        const blogData=await dataModel.findOne({_id:blog});       //Finding blog that has to be deleted
        if(blogData&& Object.keys(blogData).length>0){
            await dataModel.findOneAndDelete({_id:blog})
            res.status(200).send({msg:"Deleted Successfully"})
        }else{
            res.status(400).send({msg:"There's some error while deleting"})
        }
        
    }catch(err){
        res.status(500).send({msg:err.message})
    }
})


module.exports={dataRoute}
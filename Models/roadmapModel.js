import mongoose from "mongoose";
const topicSchema = new mongoose.Schema({
    title:{type:String,required:true},
    order:{type:Number,default:0},
    subtopics:[{
        title:{type:String,required:true},
        order:{type:Number,default:0},
    }]
});

// Create the Roadmap schema
const roadmapSchema = new mongoose.Schema({
    track:{type:String,enum:["Frontend","Backend"],required:true , unique:true},
    topics:[topicSchema],

});

const Roadmap = mongoose.model("Roadmap",roadmapSchema);

export default Roadmap;
const {Schema, model} =require("mongoose");
const {createTokenForUser} = require("../services/authentitaction");

//for adding blogs
const blogSchema = new Schema(
    {
        title: {type: String, required: true},
        body: {type: String, required: true, unique: true},
        coverImageURL: {type: String},
        createdBy: {type: Schema.Types.ObjectId, ref: "user"},//points to user id
    },
    {timestamps: true}
)

const Blog= model("blog", blogSchema);

module.exports= Blog;
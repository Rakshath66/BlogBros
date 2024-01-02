const {Schema, model} =require("mongoose");

//for adding blogs
const commentSchema = new Schema(
    {
        content: {type: String, required: true},
        blogId: {type: Schema.Types.ObjectId, ref: "blog"},
        createdBy: {type: Schema.Types.ObjectId, ref: "user"},//points to user id
    },
    {timestamps: true}
)

const Comment= model("comment", commentSchema);

module.exports= Comment;
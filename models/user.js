const { createHmac, randomBytes } = require('crypto');
const {Schema, model} =require("mongoose");
const {createTokenForUser} = require("../services/authentitaction");

const userSchema = new Schema(
    {
        fullName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        salt: {type: String},
        password: {type: String, required: true},
        profileImageURL: {type: String, default: "/images/default.png"},
        role: {type: String, enum: ["USER", "ADMIN"], default: "USER"},
    },
    {timestamps: true}
)

userSchema.pre("save", function(next){ //when user saves pass, hash update it
    const user= this;

    if(!user.isModified("password")) return;//if pass not modfied keep same

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)//salt is secret
                .update(user.password)//when this password is updated
                .digest('hex');
    
    this.salt=salt;
    this.password=hashedPassword;

    next();
})

//virtual function
userSchema.static("matchPasswordAndGenerateToken", async function(email,password){ // takes users pass, created hash and compares with one in db
    const user= await this.findOne({email});
    if(!user) throw new Error('User not Found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
                .update(password)
                .digest('hex');
    
    if(hashedPassword!== userProvidedHash){
        throw new Error('Incorrect Password!');
    }

    // return {...user, password:undefined, salt:undefined}//pass shdn't be seen bu user
    // return user;
    const token = createTokenForUser(user);
    return token;
})


const User= model("user", userSchema);

module.exports= User;
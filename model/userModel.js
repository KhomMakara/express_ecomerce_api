const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { ObjectID, ObjectId } = require('bson');
// Declare the Schema of the Mongo model
const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true,
       
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type: Array,
        default: [],
    },
    address: {
        type: String,
    },
    wishlist: [{type:ObjectId,ref:"Product"}],
    isBlock:{
        type: Boolean,
        default: false,
    },
    refreshToken:{
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken:String,
    passwordResetExprires: Date,

},

{timestamps: true}
);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
});
userSchema.methods.isPasswordMatch = async function (enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password);
};

userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest("hex");
    this.passwordResetExprires = Date.now() + 30 * 60 * 1000; //10minutes
    return resettoken;
}



//Export the model
module.exports = mongoose.model('User', userSchema);


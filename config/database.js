const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try{
        mongoose.set('strictQuery',false);
        mongoose.connect("mongodb+srv://makara:123@atlascluster.uoar4gi.mongodb.net/DBecomerce?retryWrites=true&w=majority")
        console.log('Databse connected success')
    }
    catch(error){
        console.log('Database Error');
    }
}

module.exports = dbConnect;
const { json } = require("body-parser");

class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword, //this makes our search finding substring like
                $options: "i" //this makes our search case insensitive
            }
        } : {};

        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }


    filter(){
        // const queryCopy = this.queryStr -> This is copy by reference!
        let queryCopy = {...this.queryStr}; //to copy NOT by reference but by value

        //Removing some fields for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key => delete queryCopy[key]);

        //Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        queryCopy = JSON.parse(queryStr);



        this.query = this.query.find(queryCopy);
        return this;
    }


    pagination(resultPerPage){
        const currPage = Number(this.queryStr.page) || 1;
        const numToSkip = resultPerPage * (currPage - 1);  //to understand logic see notes! 

        this.query = this.query.limit(resultPerPage).skip(numToSkip);
        return this;
    }
}


module.exports = ApiFeatures;
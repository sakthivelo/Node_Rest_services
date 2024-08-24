import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
app.use(express.urlencoded({extended:false}))
app.use(express.json());

dotenv.config();
//process.env.TOKEN_SECRET;

function generateToken(appname){
    return jwt.sign(appname,process.env.TOKEN_SECRET,{ expiresIn: '5m' });
}


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) res.status(404)
    jwt.verify(token,process.env.TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(404).send("your token expired!!");
        req.user = user;

        next()
    })
}


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No content is returned for OPTIONS requests
    }

    next();
});

app.get('/gettoken',(req,res)=>{
    try{
        if(req.query.app) {
            const token = generateToken({appname : req.query.app})
            res.send({token:token})
        } else {
            throwError('App name to generate token is not found!');
        }
    } catch(Err){
        next(Err);
    }
})

let data = [{
    id:1,
    title:"Test1",
    author:"author1",
    publishedDate: 2002
},
{
    id:2,
    title:"Test2",
    author:"author3",
    publishedDate: 2003
}];


app.get('/getbooks', authenticateToken,(req, res) => {
    try{
        res.send(data);
    } catch(Err) {
        next(Err);
    }  
})

app.get('/getbook/:id', authenticateToken,(req, res) => {
    try{
        if(Number(req.params.id)){
            let bookId = req.params.id;
            let result = data.filter(res=>res.id == bookId)
            if(Object.keys(result).length > 0){
                res.send(result);
            } else {
                res.status(404).send("No records found!!")
            } 
        }
    } catch(Err) {
        next(Err);
    }  
})

app.post('/addbook', authenticateToken,(req, res) => {
    try{
        if(Object.keys(req.query).length > 0){
            let newbook = req.query; //uncomment and use this variable value to get it from post request
            if(Object.keys(newbook).length >0){
                newbook.id = data.length+1;
                data.push(newbook);
                res.send(data);
            } else {
                res.status(400).send("Send book details to add!!");
            }
        }
    } catch(Err) {
        next(Err);
    }
})

app.put('/updatebook/:id', authenticateToken,(req, res) => {
    try{
        let bookId = req.params.id;
        if(Number(bookId)) {
            let inputParams = req.query;
            let index = data.findIndex(res=>res.id == bookId);
            if(index !== -1){
                data[index].title = (inputParams.title) ? inputParams.title : data[index].title;
                data[index].author = (inputParams.author) ? inputParams.author : data[index].author;
                data[index].publishedYear = (inputParams.publishedYear) ? inputParams.publishedYear : data[index].publishedYear;
                res.send(data);
            }else {
                res.status(404).send("No records found!!")
            } 
        }        
    } catch(Err) {
        next(Err);
    } 
})

app.delete('/deletebook/:id', authenticateToken, (req, res) => {
    try{
        let bookId = req.params.id;
        if(Number(bookId)) {
            let result = data.filter(res=>res.id != bookId);
            if(Object.keys(result).length > 0){
                res.send(result);
            } else {
                res.status(404).send("No records to delete!!")
            }
        } 
    } catch(Err) {
        next(Err);
    }   
})

app.use((req, res, next) => {
    const error = new Error('Something wrong. Please check the required input!!');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});


app.listen(3000,()=>{
    console.log("Server listening on port 3000");
})
import express  from "express";
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

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


app.get('/getbook/:id', (req, res) => {
    let bookId = req.params.id;
    let result = data.filter(res=>res.id == bookId)
    if(Object.keys(result).length > 0){
        res.send(result);
    } else {
        res.status(404).send("No records found!!")
    }   
})

app.post('/addbook', (req, res) => {
    //let newbook = req.query; //uncomment and use this variable value to get it from post request
    let newbook = {
        id: 3,
        title:'testtitle',
        author:'test authot',
        publishedDate :  new Date().getFullYear()
    }   //comment this object while  executing from postman
    data.push(newbook);
    res.send(data);
})

app.put('/updatebook/:id', (req, res) => {
    let bookId = req.params.id;
    let index = data.findIndex(res=>res.id == bookId);
    if(index !== -1){
        data[index].title =  "updated title";//have to assign value of bookTitle
        res.send(data);
    }else {
        res.status(404).send("No records found!!")
    }   
})

app.delete('/deletebook/:id', (req, res) => {
    let bookId = req.params.id;
    let result = data.filter(res=>res.id != bookId);
    if(Object.keys(result).length > 0){
        res.send(result);
    } else {
        res.status(404).send("No records deleted!!")
    }
   
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

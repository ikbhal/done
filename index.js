const { request } = require('express');
var express = require('express');
var path = require('path');
var port = process.env.port || 8000 
var app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('viewengine','ejs');
app.use(express.static('public'));
app.use(express.json());

var itemCounter = 3;

var doneList = [
    {
        id: 1,
        name: 'jigs store',
        isDone: false,
    },
    {
        id: 2,
        name: 'blockly website variable, if',
        isDone:  false
    },
    {
        id: 3,
        name: 'quiz',//quize one qusetion  4choices
        isDone: false
    }
];

app.get('/', (rq,res)=>{
    res.send("done backend");
});
app.get('/ping', (req,res)=>{
    res.send("pong");
}); 

//use t or text 

// get all items q name=quiz
app.get('/items', (req, res)=>{
    var q = req.query;
    var result = {};
    if('name' in q){
        console.log(" q.name found ", q.name);
        var name = q.name;
        item = doneList.find(it => {
            console.log("it.name:"+it.name + " == " + " name:" +name);
            return it.name == name;   
        });
        console.log("item: ", item);
        result = item;
    }else{
        result = doneList;
    }
    res.json(result);
});

// get one item by id
app.get('/items/:id', (req, res)=>{
    var id = req.params.id;
    var item = doneList.find(item => item.id ==id);
    console.log("id"+id);
    // res.send("recieve id:"+id);
    res.json(item? item : {});
});
// delete api
app.delete('/items/:id', (req, res)=>{
    var id = req.params.id;
    doneList = doneList.find(item => item.id !=id);
    res.json({status: 'sucess'});
});

// update toggle
app.put('/items/:id/toggledone', (req, res)=>{
    var id = req.params.id;
    var item = doneList.find(it => it.id ==id);
    item.isDone = !item.isDone;

    res.json(item);
});

// update item
app.put('/items/:id', (req, res)=>{
    var b= req.body;
    var id = req.params.id;
    var item = doneList.find(it => it.id ==id);
    if('isDone' in b){
        item.isDone = b.isDone;
    }
    if('name' in b){
        item.name = b.name;
    }
    res.json(item);
});

app.post('/items', (req, res)=>{
    var b = req.body;
    var text = b.text;
    var id = ++itemCounter;

    var item = {text, id, isDone: false};
    doneList.push(item);

    console.log("b:", b);
    // res.send("recieved post");
    // res.send(doneList);
    res.send(item);
});

app.listen(port , (err)=>{
    if(err){
        console.error("can not start server ",err)
    }else{
        console.log("server started at port ", port)
    }
});
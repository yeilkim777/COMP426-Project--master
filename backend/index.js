// backend
//const { response } = require('express');
const express = require('express');

const app = express();

const cors = require('cors');
app.use(cors());

const bodyParse = require('body-parser');
app.use(bodyParse.json())

// Each level object contain two arrays, one for time rank, one for move rank

const Rank = require('./Rank.js')

app.get('/time/:id', (req,res) => {  // id is level number
    //req is request made following the format in axios call, look at twitTwit
    //res is respond sent 
    let stringID = req.params.id.toString()
    if (stringID < 1 || stringID > 20) {
        res.status(404).send("Level does not exist")
    } else {
        return res.json(Rank.getTimeRank(stringID));
    }
    return 
}) 

app.get('/move/:id', (req,res) => {  // id is level number
    //req is request made following the format in axios call, look at twitTwit
    //res is respond sent 
    let stringID = req.params.id.toString()
    if (stringID < 1 || stringID > 20) {
        res.status(404).send("Level does not exist")
    } else {
        return res.json(Rank.getMoveRank(stringID));
    }
    return 
}) 

app.put('/time/:id', (req,res) => {  // id is level number
    //req is request made following the format in axios call, look at twitTwit
    //res is respond sent 
    let stringID = req.params.id.toString()

    res.json(Rank.updateTimeRank(stringID, req.body));
    //return 
}) 

app.put('/move/:id', (req,res) => {  // replace the whole array
    //req is request made following the format in axios call, look at twitTwit
    //res is respond sent 
    let stringID = req.params.id.toString()
    res.json(Rank.updateMoveRank(stringID, req.body));

    //return 
}) 

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Running testing backend for ranking')
})




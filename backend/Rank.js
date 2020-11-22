const { json } = require('express');

const rankObject = require('data-store')({ path: process.cwd() + '/backend/data/rank.json' })

// class Player {
//     constructor(player, time, move, rank) {
//         this.player = player;
//         this.time = time;
//         this.move = move;
//         this.rank = rank;// create two different ranks, one for time and move
//     }
// }

class Rank {
    constructor(timeRank, moveRank) {
        this.time = [];
        this.move = [];
    }
}

Rank.getTimeRank = (id) => {
    let tRank = rankObject.get(id);
    let test = rankObject.get(id);
    if (test.time != undefined) {
        return tRank.time;
    }
    return null;
}

Rank.getMoveRank = (id) => {
    //return sorted array of move rank
    let mRank = rankObject.get(id);
    let test = rankObject.get(id);
    if (test.move != undefined) {
        return mRank.move;
    }
    return null;

}

Rank.updateTimeRank = (id, updateArray) => {
    let tRank = rankObject.get(id);
    tRank["time"] = updateArray;
}

Rank.updateMoveRank = (id, updateArray) => {
    let mRank = rankObject.get(id);
    mRank["move"] = updateArray;
}

module.exports = Rank;
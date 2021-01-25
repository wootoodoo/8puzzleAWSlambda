const express = require('express');
const bodyParser = require('body-parser');
const Solver = require(__dirname + "/functions/solver.js");
const Board = require(__dirname + "/functions/board.js")
const _ = require('lodash');
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

exports.handler = function (event, context, callback) {
    let obj = JSON.parse(event.body);
    let a = obj.array;
    console.log("array a: ", a);
    var arr1 = a.split("#");
    var arr2 = [];
    for (let i = 0; i < arr1.length; i++) {
        arr2[i]=arr1[i].split(",");
    }       
    var solution = new Solver(arr2);

    let answer = {
        numSteps: solution.numSteps,
        history: solution.history.reverse()
    }
    
    let answerJSON = JSON.stringify(answer);
    
    let response = {
        statusCode: 200,
        headers: {
            "Content-Type" : "application/json"
        },
        body: answerJSON
    };
    
    callback(null, response);
}
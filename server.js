const express = require('express')
const app = express()
const axios = require('axios');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser')
const request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const uri = "https://new-chat-api-line.herokuapp.com";

//var io = require('socket.io')(app);

// var datetime = require('node-datetime');
// var dt = datetime.create();
// var formatted = dt.format('Y-m-d H:M:S');


var config = "";
var socket_id = "";
var shop_id = "";

if(config){
    const client = new line.Client(config);
}


app.post('/webhook', (req, res) => {
    // let reply_token = req.body.events
    //console.log(req.body.events[0].message.text)
    var  re_token = req.body.events[0].source.userId
    console.log(req.body.events);
    console.log(req.body.events[0].message.contentProvider);
    
    io.sockets.to(socket_id).emit('receiveMsg',{shop_id:shop_id,line_id:re_token,message:req.body.events[0].message.text})
    console.log(re_token)
    if(config != ""){
        //console.log(config)
        //const client = new line.Client(config);

        // add db type 1
    }else{
        console.log("is not' config ")
    }

})



function handleEvent(event) {
    console.log(shop_id)
    var line_id = event.source.userId;
    client.getProfile(line_id)
    .then((profile) => {
      console.log(profile.displayName);
      console.log(profile.userId);
      console.log(profile.pictureUrl);
      console.log(profile.statusMessage);
    })
    .catch((err) => {
      // error handling
      console.log(error);
    });
}

app.set('port', (process.env.PORT || 80));
var server = app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});

var io = require('socket.io').listen(server);


io.sockets.on('connection' , function(socket){

    socket.on('syncUser',async function(data){
        //await io.sockets.to(socket.id).emit('test',res.line_user)
        shop_id = data.shop_id
        socket_id = socket.id
        config = {
            channelAccessToken: data.access_token,
            channelSecret: data.channel_secret
        }
        var res = await getUser(data.shop_id);
        await io.sockets.to(socket.id).emit('syncUser',res.line_user)
    })

    socket.on('sendMsg', function(data){

        if(config != ""){
            const client = new line.Client(config);
            var msg = {
                type: 'text',
                text: data.message
            };
    
            client.pushMessage(data.user_id, msg);

            axios.post(uri+'/chats/create', {
                spf_id_pk: data.shop_id,
                line_id: data.user_id,
                message: data.message,
                type: 1,
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });


        }else{
            console.log("is not' config ")
        }
    })
    
})

async function getUser(shop_id) {
    try {
      const response = await axios.get(uri+'/users/'+shop_id);
        //console.log(response.status);
        if(response.status==200){
            return response.data.data;
        }
        //return response.data
    } catch (error) {
        //console.error(error);
        return 404;
    }
}



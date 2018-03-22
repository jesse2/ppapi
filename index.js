var express=require('express');
var paypal=require('paypal-rest-sdk');
var request=require('request');
var bodyParser=require('body-parser');
var cors=require('cors');
var app=express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send('Hello World from test server updated');
});

app.post('/create-payment1/', async function(req,res){
    var auth={
        user:'AfNpCz974apNThOLr60y8Pe4_7sfoTFoxtmozQfiqd7opP9J4nTYxa1C3ZV4mL-M2X_RoTdHmwdxrOVI',
        pass:'EPPZpa9iL2TTmr0n28oRyvvILOId91QD38GQcWObH13sHkoOtG_HLE47dvfcQxjukNlfNKENz9hAHa65'
    };

     await request.post({url:'https://api.sandbox.paypal.com/v1/oauth2/token', body:'grant_type=client_credentials', auth:auth}, (e,r,body)=>{
    var huu=JSON.parse(body);
    res.send(huu.access_token);
    });
});

app.post('/create-payment2/', async function(req,res){
    var auth={
        bearer:req.body.token
    };
    var uri='https://api.sandbox.paypal.com/v1/payments/payment';
    var body={
        intent: 'sale',
              payer: {
                payment_method: 'paypal'
              },
              transactions: [{
                  amount: { total: '10.00', currency: 'USD' }
              }],
              redirect_urls: {
                return_url: 'https://www.mysite.com',
                cancel_url: 'https://www.mysite.com'
              }
    }
    await request.post({uri:uri,body:body, json:true, auth:auth },(e,r,body)=>{
        res.send(body.id);
    });
});

app.post('/execute-payment/', async function(req,res){
    let ato=req.body.info;
    let paymentID=req.body.info2;
    let payerID=req.body.info3;

    var auth={
        bearer:ato
    };
    
    var body={
        payer_id:payerID
    };
    
    var uri=`https://api.sandbox.paypal.com/v1/payments/payment/${paymentID}/execute`;
    await request.post({uri:uri, auth:auth, json:true,body:body},(e,r,body)=>{
    //res.json(body);
    res.send(body);
    });
    });

    app.listen(3000,function(){
        console.log('listening on port 3000');
    });
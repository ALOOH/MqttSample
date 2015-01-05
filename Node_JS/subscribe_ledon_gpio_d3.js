var mqtt = require('mqtt'), url = require('url');
var GPIO = require('snow/gpio');
//Auth Key 수정필요
var mqtt_url = url.parse('mqtt://b762f251aba841ceb0cf7d7dcdb41c12:test@api.alooh.io:1883');
              
var auth = (mqtt_url.auth || ':').split(':');
var nGpio = 3;
var index = 0;
var result = 0;
var gpio = new GPIO.gpio();
var intervalHandler;
gpio.open();

gpio.pinMode(nGpio, 1);      // D3 out 

function ledStatus(){
    
  if(index < count*2)
  {
    if(index == 0 || index%2 == 0)
      gpio.digitalWrite(nGpio, 1);
    else
      gpio.digitalWrite(nGpio, 0);
  }
  
  index++;
  if(index == (count+2)*2)
    index = 0;
};

function interval(arg)
{
  if(arg == 0)
    gpio.digitalWrite(nGpio, 1);
  else
  {
    count = arg;
    intervalHandler = setInterval(ledStatus, 200);
  }
};

var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
  username: auth[0],
  password: auth[1]
});

//Auth Key 수정필요
client.subscribe('54a26953d62e1c0b0a78ee65', function() {
  client.on('message', function(topic, message, packet) {

  	console.log("Received '" + message + "' on '" + topic + "'");
    if(message == "on" || message == "ON" || message == "On")
    {
      gpio.digitalWrite(nGpio,1);
      clearInterval(intervalHandler);
    }
    if(message == "off" || message == "OFF" || message == "Off")
    {
      gpio.digitalWrite(nGpio,0);
      clearInterval(intervalHandler);
    }
    if(message == "repeat2")
    {
      clearInterval(intervalHandler);
      interval(2);
    }
	});
});
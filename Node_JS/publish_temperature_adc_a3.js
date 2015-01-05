var mqtt = require('mqtt'), url = require('url');
var ADC = require('snow/adc');
var adc = new ADC.adc();
// Auth Key 수정필요
var mqtt_url = url.parse('mqtt://b762f251aba841ceb0cf7d7dcdb41c12:test@api.alooh.io:1883');
var auth = (mqtt_url.auth || ':').split(':');
var result;
var dataString;



adc.open();
adc.attach(3);

var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
  username: auth[0],
  password: auth[1]
});


setInterval(function(){
  input = adc.read(3, 1000);
	
	voltage = (input*3.3/4096); 
	
	temperature = (voltage)*100;
	
	result = temperature.toFixed(1);
	var time = new Date();
	
	var data = { data:
    { data_streams:
        [
            {
                id: auth[0],
                data_points: [
                    {
                        v: result,
                        t: time.toString()
                    }
                ]
            }
        ]
    }
}	
	dataString = JSON.stringify(data);
  // Topic ID 수정필요
	 client.publish('54a26953d62e1c0b0a78ee65', dataString, function() {
	 console.log('temperature : %j',dataString);
	 });
	 
	 
}, 1000);
 

 
var riftData;

function GetRiftMagicite(callback){
	$.getJSON('./data/rift.json', function(data) {         
		riftData = data[0];
		
		callback();
	});
}
var pandeData;

function GetPandeMagicite(callback){
	$.getJSON('./data/pande.json', function(data) {    
		pandeData = data[0];
		
		callback();
	});
}
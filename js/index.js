const GAME = {
	max_magicite: 20000
}

function parseInt2(input){
	if(!input) return 0;
	return parseInt(input.toString().replace(/,/g,'')) || 0;
}

function numberWithCommas(x) {
  x = x.toFixed(0);
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function initDone(){
	
	if(pandeData){
		renderCalc();
		$("input[name='magicite_seal']").val(pandeData.MagiciteSeal);
		updateChange();
	}
	else{
		alert("Error loading data. Please refresh the page");
	}
}

function updateChange(){	
	var times_hard = 0, 
		until_hard = 0, 
		times_normal = 0, 
		until_normal = 0,
		amt_distiller = 0,
		until_distiller = 0;
	var farm_magicite;
	var optimized_magicite;
	var isFulfilled = false;
	
	var mag_hard = 60;
	var mag_normal = 25; 
	var magicite_seal = parseInt2($("input[name='magicite_seal']").val()) || pandeData.MagiciteSeal
	
	var current_magicite = parseInt2($("input[name='magicite']").val());
	var remain_magicite = GAME.max_magicite - current_magicite;
		
	mag_hard += magicite_seal;
	mag_normal += magicite_seal;
	
	$("#use_distiller").hide();
	
	$("#magicite_hard").text(mag_hard);
	$("#magicite_normal").text(mag_normal);
	$("#magicite_remain").text(numberWithCommas(remain_magicite));
	
	if(current_magicite < GAME.max_magicite){
		times_hard = Math.floor(remain_magicite/mag_hard);
		
		do{
			mainLoop:
			for(var i=times_hard; i >= 0; i--){
				var j = 0;
				
				do {
					farm_magicite = i * mag_hard + j * mag_normal + current_magicite + amt_distiller;
					
					if(farm_magicite < GAME.max_magicite && ((farm_magicite % 20) == 19)){
						times_hard = i;
						times_normal = j;
						break mainLoop;
					}
					
					j++;
				}while(farm_magicite < GAME.max_magicite);
			}
			if(farm_magicite < GAME.max_magicite || (farm_magicite % 20) == 19){
				isFulfilled = true;
			}
			else{
				amt_distiller++;
			}
		}while(!isFulfilled);
		
		if(farm_magicite > GAME.max_magicite || (farm_magicite % 20) != 19){
			times_hard = 0;
			times_normal = 0;
			amt_distiller = 0;
		}
	}
		
	until_hard = times_hard * mag_hard + current_magicite + amt_distiller;
	until_normal = times_normal * mag_normal + until_hard;
	until_remain = GAME.max_magicite - 1 - until_normal;
	until_distiller = amt_distiller + current_magicite;
	
	if(amt_distiller){
		$("#use_distiller").show();
		$("#amt_distiller").text(amt_distiller);
		$("#until_distiller").text(numberWithCommas(until_distiller));
	}
	
	$("#times_hard").text(times_hard);
	$("#until_hard").text(numberWithCommas(until_hard));
	
	$("#times_normal").text(times_normal);
	$("#until_normal").text(numberWithCommas(until_normal));
	$("#until_remain").text(until_remain);
}

function init() {
	renderLoading();
	GetPandeMagicite(initDone);
}

function renderLoading() {
	$('#loading_div').removeClass('d-none');
	$('#loading_div').addClass('d-flex');
	$('#main_div').show();
	$('#main_div').addClass("d-none");
	$('#main_div').fadeToggle("slow");
}

function renderCalc() {
	$('#loading_div').addClass('d-none');
	$('#loading_div').removeClass('d-flex');
	$('#main_div').hide();
	$('#main_div').removeClass("d-none");
	$('#main_div').fadeToggle("slow");

}

$(document).ready(function() {
	init();
	
	$("#setting_input").change(function(){
		updateChange();
	});
});
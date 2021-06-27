$( document ).ready(function() {





	//Sorting Algorithms
	var el = $('#item_parent');
	var items = [];
	let bubbleRun = false;
	let speed = 10;

	// Init user variables
	let volume = 0;

	let slider = $("#el_slider");			//Number of elements
	let N = slider.val();
	let displayN = $("#num_of_els");
	displayN.val(N);
	slider.change(()=>{
		if(bubbleRun == false){
			N = slider.val();
			displayN.val(N);
			resetElements(N);
		}
	});

	let slider_speed = $("#speed_slider");			//Speed
	let X = slider.val();
	let displayX = $("#speed_num");
	displayX.val(X);
	speed = X;
	slider_speed.change(()=>{
		X = slider_speed.val();
		displayX.val(X);
		speed = X;

	});

	let slider_volume = $("#volume_slider");			//Volume
	let Y = slider_volume.val();
	volume = Y;
	slider_volume.change(()=>{
		Y = slider_volume.val();
		volume = Y;

	});

	//Genrate elements
	for(let i = 0; i < N; i++){
	    let rand = Math.floor(Math.random() * 300) + 1;
	    el.append("<div class='item d-flex justify-content-between' data-height='"+rand+"' style='height: "+rand+"px; flex: 1; margin: 0 1px;'></div>");
	}

	//Populating the array with the elements
	items = $(".item");

	function resetElements(num){
		el.empty();
		for(let i = 0; i < num; i++){
			let rand = Math.floor(Math.random() * 300) + 1;
			el.append("<div class='item d-flex justify-content-between' data-height='"+rand+"' style='height: "+rand+"px; flex: 1; margin: 0 1px;'></div>");
		}
		items = $(".item");
	}

	async function BubbleSort(){
		let sorted = false;
		let lastSorted = items.length;
		let ctx = new (window.AudioContext || window.webkitAudioContext)();
		let gainNode = ctx.createGain();
		while(!sorted){
			bubbleRun = true;
		    sorted = true;
		    for (let i = 0; i < lastSorted ; i++){
				//Audio
				let osc = ctx.createOscillator();
				osc.connect(gainNode);
				gainNode.connect(ctx.destination);
				osc.start();
				gainNode.gain.setValueAtTime(volume, ctx.currentTime);
		    	await sleep(speed);
	    		$(items[i]).css('backgroundColor', 'yellow');
				$(items[i + 1]).css('backgroundColor', 'yellow');

				let currHeight = $(items[i]).data('height');

				osc.frequency.setValueAtTime(currHeight, ctx.currentTime);

		        if (currHeight > $(items[i+1]).data('height')){
		        	await sleep(speed);
	        		$(items[i]).css('backgroundColor', 'red');
		    		$(items[i + 1]).css('backgroundColor', 'red');
		    		await sleep(speed);
		    		swapHeight(items, i, i+1);
		    		await sleep(speed);
	            	sorted = false;
		        }else{
					$(items[i]).css('backgroundColor', 'blue');
					$(items[i + 1]).css('backgroundColor', 'blue');
					await sleep(speed);
				}
		        $(items[i]).css('backgroundColor', 'black');
				$(items[i+1]).css('backgroundColor', 'black');
		    	

		    	if(i == lastSorted - 1){
		    		for(let j = i; i < items.length; i++){
		    			$(items[j]).css('backgroundColor', 'green');
		    			$(items[j + 1]).css('backgroundColor', 'green');
		    			console.log(i + "" +(lastSorted - 2));
		    		}
		    	}
				osc.stop();
		    }
		    lastSorted--;

		}

		bubbleRun = false;
		for(let i = 0; i < items.length; i++){
			let osc = ctx.createOscillator();
			osc.connect(ctx.destination);
			osc.start();
			let currHeight = $(items[i]).data('height');
			osc.frequency.setValueAtTime(currHeight, ctx.currentTime);

			await sleep(speed);
			$(items[i]).css('backgroundColor', 'purple');
			osc.stop();
		}
	}


	const sleep = (milliseconds) => {
  		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	//Bubble sort operations
	//start
	$(document).on('click', '#bubble_sort_start', ()=>{
		if(bubbleRun == false)
			BubbleSort();
	});
	$(document).on('click', '#bubble_sort_reset', ()=>{
		if(!bubbleRun){
			resetElements(N);
		}
	});

	$(document).on('click', '#volume_onoff', ()=>{
		$("#volume_onoff").prop("checked", !checkBoxes.prop("checked"));
	});
	
	function swapHeight(elArray, firstIndex, secondIndex){

		let temp = $(elArray[firstIndex]).data('height');
	    let temp2 = $(elArray[secondIndex]).data('height');

	    $(elArray[firstIndex]).data('height', temp2);
	    $(elArray[firstIndex]).css('height', temp2 + "px");
	    $(elArray[secondIndex]).data('height', temp);
	    $(elArray[secondIndex]).css('height', temp + "px");

	}

});
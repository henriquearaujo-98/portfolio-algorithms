$( document ).ready(function() {



	//Sorting Algorithms
	let done = false;
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
	
	const sleep = (milliseconds) => {
  		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	//Quick sort operations
	//start
	$(document).on('click', '#quick_sort_start', ()=>{
		if(bubbleRun == false)
			quickSort(items,0, items.length - 1);
	});

	$(document).on('click', '#quick_sort_reset', ()=>{
		if(!bubbleRun){
			resetElements(N);
		}
	});




	async function quickSort(arr, start, end) {
		done = checkSort();
		if(done){
			wrapUp();
			return;
		}

	  if (start >= end) {
	  	return;
	  }

	  let index = await partition(arr, start, end);

	  await Promise.all([
	    quickSort(arr, start, index - 1),
	    quickSort(arr, index + 1, end)
	  ]);

	}

	async function partition(arr, start, end) {
	  let pivotValue = $(arr[end]).data('height');
	  let pivotIndex = start;
	  //Audio
	  let ctx = new (window.AudioContext || window.webkitAudioContext)();
	  let gainNode = ctx.createGain();

	  for (let i = start; i < end; i++) {

	  	//Audio
		let osc = ctx.createOscillator();
		osc.connect(gainNode);
		gainNode.connect(ctx.destination);
		osc.start();
		gainNode.gain.setValueAtTime(volume, ctx.currentTime);
		// Playing audio
		let currHeight = $(arr[i]).data('height');
		osc.frequency.setValueAtTime(currHeight, ctx.currentTime);

	    if ($(arr[i]).data('height') < pivotValue) {
	      await swapHeight(arr, i, pivotIndex);
	      $(arr[pivotIndex]).css('backgroundColor', 'purple');
	      await sleep(speed);
	      $(arr[pivotIndex]).css('backgroundColor', 'black');
	      pivotIndex++;
	      for(let j = start; j <= end; j++){
		  	if(j < pivotIndex)
		  		$(arr[j]).css('backgroundColor', 'red');
		  	else if(j > pivotIndex)
		  		$(arr[j]).css('backgroundColor', 'blue');
		  }
	    }
	    osc.stop();
	  }
	  await swapHeight(arr, pivotIndex, end);

	  for (let i = start-1; i < end+1; i++) {
	      $(arr[i]).css('backgroundColor', 'black');
	  }
	  return pivotIndex;
	}

	function checkSort(){
		for(let i = 0; i < items.length; i++){
			if($(items[i]).data('height') > $(items[i+1]).data('height'))
				return false;
		}
		return true;
	}

	async function wrapUp(){
		let ctx = new (window.AudioContext || window.webkitAudioContext)();
		let gainNode = ctx.createGain();
		for(let i = 0; i < items.length; i++){
			//Audio
			let osc = ctx.createOscillator();
			osc.connect(gainNode);
			gainNode.connect(ctx.destination);
			osc.start();
			gainNode.gain.setValueAtTime(volume, ctx.currentTime);
			// Playing audio
			let currHeight = $(items[i]).data('height');
			osc.frequency.setValueAtTime(currHeight, ctx.currentTime);

			$(items[i]).css('backgroundColor', 'green');
			await sleep(speed);

			//Closing sound
			osc.stop();
		}
	}
	
	function swapHeight(elArray, firstIndex, secondIndex){

		let temp = $(elArray[firstIndex]).data('height');
	    let temp2 = $(elArray[secondIndex]).data('height');

	    $(elArray[firstIndex]).data('height', temp2);
	    $(elArray[firstIndex]).css('height', temp2 + "px");
	    $(elArray[secondIndex]).data('height', temp);
	    $(elArray[secondIndex]).css('height', temp + "px");

}
	    
	


	//A* pathfinding algorithm

});
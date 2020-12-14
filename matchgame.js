$(function(){


	var answers = [{
			"text":		"Apple",
			"order":	"1",
			"img":"apple1.png"
		}, {
			"text":		"Banana",
			"order":	"2",
			"img":"banana1.png"

		}, {
			"text":		"Orange",
			"order":	"3",
			"img":"orange1.png"
		}, {
			"text":		"potato",
			"order":	"4",
			"img":"potato1.jpg"
		}, {
			"text":		"tomato",
			"order":	"5",
			"img":"tomato1.jpg"
		}, {
			"text":		"onion",
			"order":	"6",
			"img":"onion1.jpg"
		}, {
			"text":		"lemon",
			"order":	"7",
			"img":"lemon1.png"
		}, {
			"text":		"carrot",
			"order":	"8",
			"img":"carrot.jpeg"
		}, {
			"text":		"cabage",
			"order":	"9",
			"img":"cabage1.jpg"
		}, {

			"text":		"cucumber",
			"order":	"10",
			"img":"cucumber.jpeg"
	}];


	var subcontainers = [{
			"text":		"fruits",
			"id":		"fruits"
		}, 
		{
			"text":		"vegetables",
			"id":		"vegetables"
		}, 
		{
			"text":		"salads",
			"id":		"salads"
		},
		
];



	var car_correct = new Array('answer1','answer2','answer3');
	var vegetables_correct = new Array('answer4','answer5','answer6');
	var train_correct = new Array('answer7','answer8','answer9','answer10');











	reset_game();																// this initializes the game
	
	$('#game_container #button_container #reset_button').click(function(){
		reset_game();
	});
	
	$('#game_container #button_container #check_button').click(function(){
		$("#game_container .qanswer").promise().done(function() { 				// promise().done() waits for any animations to complete before firing the function
			score_game();														// this is necessary because any divs that have not yet finished the "drop" animation will not be scored
		});
	});
	
	$('#game_container #ok_button').click(function(){
		$('#game_container #message').animate( {
			width: '0',
			height: '0',
			padding: '0',
			opacity: 0
		}, 1000).hide(1000);
	});

	function reset_game() {
		$('#game_container #draggable_container').html('').removeClass();
		$('#game_container #droppable_container').html('');
		
		$('#game_container #check_button').removeAttr('disabled');
		
		$('#game_container #message').hide();
		$('#game_container #score_container').hide();

		for (var j=0; j<3; j++) {
			$('<div><strong>' + subcontainers[j].text + '</strong></div>').attr('class', 'subcontainer').attr('id', subcontainers[j].id).appendTo('#game_container #droppable_container').sortable({
				containment: "#game_container",
				cursor: "move",
				items: "div",
				revert: 250,
				connectWith: "#game_container .subcontainer",
				receive: function(event, ui) {
					if (ui.item.parents('#game_container .subcontainer')) {
						ui.item.removeClass('dragthis').addClass('dropped');
					} else {
						ui.item.removeClass('dropped').addClass('dragthis');
					}
				}
			}).disableSelection();
		}

		answers.sort(function(){ return (Math.round(Math.random())-0.5); });
		
		for (var i=0; i<answers.length; i++) {
			$('<div style="overflow:hidden;">' + answers[i].text + '<br><img src ="imgs/'+answers[i].img+'" width=200px></img></div>').attr('id', 'answer' + answers[i].order).attr('class', 'dragthis qanswer').appendTo('#game_container #draggable_container').disableSelection();
		}
		$("#game_container #draggable_container").sortable({
			connectWith: '#game_container .subcontainer',
			containment: '#game_container',
			cursor: 'move',
			items: 'div',
			revert: 250,
		}).disableSelection();
	}
	
	function score_game() {
		if (!$("#game_container #draggable_container").is(":empty")) {
			
			$('#game_container #message #text').html('The game is not complete! Please drag all answers to a category first.');
			
			$('#game_container #message').show().css({
				top: $("#game_container #droppable_container").position().top-50,
				left: $("#game_container #droppable_container").position().left+100
			}).animate( {
				width: '450px',
				height: '80px',
				padding: '20px',
				opacity: 1
			}, 500);
			
			return;
		}


		$("#game_container .subcontainer").each(function(index){
			$(this).sortable("option","disabled",true);
		});
		
		$('#game_container #button_container #check_button').attr("disabled", "disabled");
		


		$correctcounter = 0;																				// keep track of how many are right
		$("#game_container .dropped").each(function(index){
			$thisid = $(this).attr('id');																	// shortcuts
			$parentid = $(this).parent().attr('id');
			$(this).css('cursor','default');																// UI helper to help the user know the elements are no longer draggable
			if (																							// big long if statement to see if the element is in the right place
				($.inArray($thisid, car_correct) > -1 && $parentid == 'fruits') ||
				($.inArray($thisid, vegetables_correct) > -1 && $parentid == 'vegetables') ||
				($.inArray($thisid, train_correct) > -1 && $parentid == 'salads')
			) {
				$(this).addClass('correct', 800).removeClass('dropped', 800);								// it's in the right place - make it all green and happy
				$correctcounter++;																			// +1 to the counter of correct answers
			} else {
				$(this).addClass('incorrect', 800).removeClass('dropped', 800);								// it's in the wrong place - make it all red and sad
			}
		});
		
		$('#game_container #score_container #score_text').html('You got <span class="score">' + $correctcounter + '</span> out of 10 correct!');
		$('#game_container #score_container').slideDown(500);
	}
})
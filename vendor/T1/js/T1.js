/**
 * Copyright 2018 p5yb14d3. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 */
 
var ctx = null;
var initStage = 0;

// create load file feature
file_browser = document.createElement("input");
file_browser.setAttribute("type", "file");
file_browser.id = "file_browser";
document.body.appendChild(file_browser);
file_browser.addEventListener('change', function() { loadFileAsText(file_browser); }, false);

// variable for save file feature
var fileContents = "";
var T1_folder = ""; // path to T1 folder. 

function loadScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}


// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function commands(line) {
	T1commands(line);
}

window.addEventListener("load", initTerminal, false);

var settings = {
	cols: 40, 
	rows: 20,
	line_height: 20,
	padding_bottom: 10,
	text_color: "#C0C0C0",
	text_height: 20,
	prompt_text: "c:\\>",
	font: "12pt commodore",
	cursor_top: 4,
	cursor_width: 16, // 8
	cursor_height: 18, // 3
	prompt_color_random: true
}

var print_buffer = true;
var file_contents = "";
var terminal = new classTerminal();

function loadFileAsText(file_browser) {
	var fileToLoad = file_browser.files[0];
	var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent){ 
			fileContents = print_buffer = fileLoadedEvent.target.result;
			terminal.text.printEnter(false);
			terminal.print();
		};
	fileReader.readAsText(fileToLoad, "UTF-8");
}

function initTerminal() {
	terminal.cols = settings.cols;
	terminal.rows = settings.rows;
	terminal.line.height = settings.line_height;
	terminal.padding_bottom = settings.padding_bottom;
	terminal.text.color = settings.text_color;
	terminal.text.height = settings.text_height;
	terminal.font = settings.font;
	terminal.cursor.top = settings.cursor_top;
	terminal.cursor.width = settings.cursor_width;
	terminal.cursor.height = settings.cursor_height;

	terminal.canvas.id = "T1000canvas";
	document.body.append(terminal.canvas);
	
	// set listeners
	window.addEventListener("keydown", terminal.onKeydown);
	window.addEventListener("keypress", terminal.onKeypress);
	
	// set context
	ctx = terminal.canvas.getContext("2d");
	ctx.font = terminal.font;

	var metrics = ctx.measureText("W");
	terminal.text.width = Math.ceil(metrics.width);
	
	// set canvas dimensions
	ctx.canvas.width  = (terminal.text.width * terminal.cols);
	ctx.canvas.height = (terminal.line.height * terminal.rows) + terminal.padding_bottom;

	// init prompt
	terminal.prompt.width = terminal.text.width * terminal.prompt.text.length;
	
	// init cursor
	terminal.cursor.x = terminal.prompt.width;
	terminal.cursor.y = 0;

	terminal.screen.clear();
	
	terminal.prompt.draw();
	
	initStage = 1;
	
	setInterval(terminal.cursor.blink,300);
	
	loadScript('vendor/beepjs/beep.js', function() {});
	loadScript('vendor/speak-js/speakClient.js', function() {});
	loadScript(T1_folder + 'js/T1commands.js', function() {});
}
	
function classTerminal() {
	this.mesh;
	this.canvas = document.createElement("canvas");
	this.ctx;
	this.screen = new classScreen();
	this.text = new classText();
	this.line = new classLine();
	this.cursor = new classCursor();
	this.prompt = new classPrompt();
	this.flag_ready = false;
	this.cols = 40;
	this.rows = 20;
	this.blinkCounter = 0;
	this.padding_bottom = 10;
	this.font = '12pt commodore';
	this.settings = {};
	this.app = "";
	this.sound = new classSound();
	
	this.print = function(text) {
		if (typeof text === 'string' || text instanceof String) {
			if ((print_buffer == "") || (print_buffer == true)) print_buffer = "\t";
			print_buffer += "\n"+text;
			setTimeout(terminal.print, 100);
			return;
		}

		if (print_buffer.length > 0) {
			output_char = print_buffer.substring(0,1);
			print_buffer = print_buffer.slice(1, print_buffer.length);
			if (output_char == "\n") {
				terminal.text.printEnter(false);
			}
			else {
				terminal.text.printChar(output_char);
			}
			requestAnimationFrame(terminal.print);
		}
		else if (print_buffer.length == 0) {
			print_buffer = false; // print_buffer false state = on_complete
		}
		if (print_buffer == false) {
			print_buffer = true; // print_buffer true state = rested
			
			// print prompt when print_buffer is on_complete
			terminal.text.printEnter(); 
			terminal.screen.getNewPositionX(); // refresh x pos calculation
		}	
	}

	function classScreen() {
		this.scrollUp = function() {
			var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.putImageData(imageData, 0, -terminal.line.height);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, ctx.canvas.height - terminal.line.height, ctx.canvas.width, ctx.canvas.height); // ERASE BOTTOM
			ctx.fillRect(0, 0, ctx.canvas.width, 2);
		}

		this.clear = function() {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
		}
		
		this.getNewPositionX = function() {
			terminal.cursor.x += terminal.text.width;
			if (terminal.cursor.x >= ctx.canvas.width) {
				terminal.cursor.x = 0;
				terminal.cursor.y += terminal.line.height;
				terminal.line.row += 1;
			}
			if (terminal.cursor.y + terminal.line.height > ctx.canvas.height) {
				terminal.screen.scrollUp();
				terminal.cursor.y -= terminal.line.height;
			}
		}

		this.getNewPositionY = function(draw_prompt=true) {
			terminal.cursor.y += terminal.line.height;
			if (draw_prompt) terminal.cursor.x = terminal.prompt.width - terminal.text.width; else terminal.cursor.x = 0;
			if (terminal.cursor.y + terminal.line.height > ctx.canvas.height) {
				terminal.screen.scrollUp();
				terminal.cursor.y -= terminal.line.height;
			}
		}
	}
	
	function classCursor() {
		this.x = 0;
		this.y = 0;
		this.width = 16;
		this.height = 18;
		this.top = 4;
		
		this.draw = function() {
			if ((terminal.cursor.x < terminal.prompt.width) && (terminal.line.row == 0)) {
			
			}
			else {
				ctx.fillStyle = "green";
				ctx.fillRect(terminal.cursor.x, terminal.cursor.y + terminal.cursor.top, terminal.cursor.width, terminal.cursor.height);
			}
		}

		this.erase = function() {
			if ((terminal.cursor.x >= terminal.prompt.width) || (terminal.line.row))  {
				ctx.fillStyle = "#000000";
				ctx.fillRect(terminal.cursor.x, terminal.cursor.y + terminal.cursor.top, terminal.cursor.width, terminal.cursor.height);
			}
		}

		this.blink = function(){
			var flag = terminal.blinkCounter % 3;
			switch (flag) {
				case 1 :
				case 2 :
					terminal.cursor.draw();
					terminal.blinkCounter++;
					break;
				default:
					terminal.cursor.erase();
					terminal.blinkCounter= 1;
			}
			if (initStage < 2) {
				terminal.prompt.draw(false);
				initStage += 1;
			}
			
			terminal.flag_ready = true;
		}
	}
	
	function classLine() {
		this.height = 20;
		this.row = 0;
		this.text = "";
	}
	function classText() {
		this.width = 20;
		this.height = 20;
		this.color = "#C0C0C0";
		this.string = ""
		
		this.draw = function (charCode) {
			var character = String.fromCharCode(charCode);
			terminal.line.text += character
			ctx.font = terminal.font;
			ctx.fillStyle = terminal.text.color;
			ctx.fillText(character, terminal.cursor.x, terminal.cursor.y+terminal.line.height);
		}
		
		this.print = function (outputChar) {
			ctx.font = terminal.font;
			ctx.fillStyle = terminal.text.color;
			ctx.fillText(outputChar, terminal.cursor.x, terminal.cursor.y+terminal.line.height);
		}
		
		this.printChar = function (output_char) {
			terminal.cursor.erase();
			terminal.text.print(output_char);
			terminal.screen.getNewPositionX();
			terminal.cursor.draw();
		}
		
		this.printEnter = function(draw_prompt=true) {
			terminal.cursor.erase();
			terminal.line.row = 0;
			terminal.screen.getNewPositionY(draw_prompt);
			if (draw_prompt) terminal.prompt.draw(settings.prompt_color_random);
		}
		
		this.erase = function() {
			if ((terminal.cursor.x > terminal.prompt.width) || (terminal.line.row > 0)) {
				terminal.cursor.erase();
				
				terminal.cursor.x-=this.width;
				if (terminal.cursor.x < 0) {
					terminal.cursor.y -= terminal.line.height;
					terminal.cursor.x = ctx.canvas.width - this.width;
					terminal.line.row -= 1;
				}
				ctx.fillStyle = "blue";
				ctx.fillRect(terminal.cursor.x, terminal.cursor.y + terminal.cursor.top, this.width, terminal.line.height - terminal.cursor.top);
			}
		}
	}
	function classPrompt() {
		this.width = "";
		this.color = "#FFFFFF";
		this.text = "c:\\>";
		
		this.draw = function(){
			terminal.text.string = terminal.prompt.text;
			ctx.font = terminal.font;
			if (settings.prompt_color_random) this.color = getRandomColor();
			ctx.fillStyle = this.color;
			ctx.fillText(terminal.text.string, 0 , terminal.cursor.y + terminal.line.height);
		}
		
		this.set = function(itext) { // this is to change the prompt label
			this.text = itext;
			terminal.prompt.width = terminal.text.width * terminal.prompt.text.length;
		}
	}
	
	function classSound() {
		this.enabled = true;
		this.voice_enabled = true;
		
		this.beep = function(keys) {
			var key = keys.shift();
			if ((typeof key == 'undefined') || (terminal.sound.enabled == false)) return;
			new Beep(22050).play(key[0], key[1], [Beep.utils.amplify(8000)], function() { terminal.sound.beep(keys); });
		}
		
		this.speak = function(message, pitch=10) {
			if ((typeof message == 'undefined') || (terminal.sound.enabled == false) || (terminal.sound.voice_enabled == false)) return;
			speak(message, {'pitch': pitch});
		}
	}

	function getRandomColor() {
		var letters = "0123456789ABCDEF";
		var color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		
		var c = color.substring(1);
		var rgb = parseInt(c, 16);
		var r = (rgb >> 16) & 0xff;
		var g = (rgb >>  8) & 0xff;
		var b = (rgb >>  0) & 0xff;

		var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

		if (luma < 40) {
			color = getRandomColor();
		}
		return color;
	}

	this.onKeydown = function(e){
		if (e.keyCode === 8) {
			terminal.line.text = terminal.line.text.substring(0, terminal.line.text.length - 1);
			e.preventDefault();
			terminal.text.erase();
		}
		else if (e.keyCode == 13) {
			commands(terminal.line.text.trim());
			
			if ((terminal.app == "jot") && (terminal.line.text.trim() != "")) fileContents = fileContents + terminal.line.text + "\n";
			if ((terminal.app == "game") && (terminal.line.text.trim() != "")) system.parseInput();
			if (print_buffer == true) terminal.text.printEnter();
			terminal.line.text = "";
		}
		terminal.flag_ready = true;
	}

	this.onKeypress = function(e){
		charCode = e.which || e.keyCode;
		e.preventDefault();
		
		terminal.cursor.erase();
			
		if (terminal.line.row < terminal.rows) {
			if (terminal.line.row == terminal.rows-1) {
				if (terminal.cursor.x < ctx.canvas.width - terminal.text.width) {
					terminal.text.draw(charCode);
					terminal.screen.getNewPositionX();
				}
			}
			else {
				terminal.text.draw(charCode);
				terminal.screen.getNewPositionX();
			}
		}
		terminal.flag_ready = true;
	}
	
}











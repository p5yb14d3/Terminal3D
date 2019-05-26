function T1commands(line) {
	var args = line.split(' ');
	command = args[0];
	if (terminal.app == "") {
		switch(command) {
			case "jot":
				terminal.app = "jot";
				terminal.prompt.set("jot:\\>");
				terminal.line.text = ""; // clear line text
				terminal.print("Welcome to Jot. The app that allows you to pen down your ideas on the fly");
				terminal.print("You will like it");
				break;
			case "game":
				terminal.app = "game";
				terminal.prompt.set("game:>");
				terminal.line.text = ""; // clear line text
				loadScript(T1_folder + 'apps/text-adventure/world.js', function() {
					loadScript(T1_folder + 'apps/text-adventure/player.js', function() {
						loadScript(T1_folder + 'apps/text-adventure/oldhouse.js', function() {
							loadScript(T1_folder + 'apps/text-adventure/garden.js', function() {
								loadScript(T1_folder + 'apps/text-adventure/system.js', function() {
									system.init();
								});
							});
						});
					});
				});
				
				break;
			case "test":
				speak('hello world!');
				terminal.print("Hello World");
				break;
			case "date":
				today = new Date();
				speak("Today is " + today.toLocaleDateString('en-US', { month: "long", day: "numeric" }));
				terminal.print("Today is " + today.toLocaleDateString('en-US', { month: "long", day: "numeric" }));
				break;
			case "time":
				today = new Date();
				speak("The time now is " + today.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}));
				terminal.print("The time now is " + today.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}));
				break;
			case "weekday":
			case "week":
			case "day":
				today = new Date();
				speak("Today is " + today.toLocaleDateString('en-US', { weekday: "long" }));
				terminal.print("Today is " + today.toLocaleDateString('en-US', { weekday: "long" }));
				break;
			case "month":
				today = new Date();
				speak("This month is " + today.toLocaleDateString('en-US', { month: "long"}));
				terminal.print("This month is " + today.toLocaleDateString('en-US', { month: "long"}));
				break;
			case "year":
				today = new Date();
				speak("The year is " + today.toLocaleDateString('en-US', { year: "numeric"}));
				terminal.print("The year is " + today.toLocaleDateString('en-US', { year: "numeric"}));
				break;
			default:
				terminal.sound.beep([[500, 0.1]]);
		}
	}
	else if (terminal.app == "jot") {
		switch(command) {
			case "help":
				print_buffer = "\t\nHELP:\n1)load\n2)save\n3)look\n4)exit";
				//terminal.text.printEnter(false);
				terminal.print();
				break;
			case "exit":
				terminal.app = "";
				terminal.prompt.set("c:\\>");
				terminal.line.text = ""; // clear line text
				break;
			case "save":
				download(fileContents, "Document", "txt");
				terminal.line.text = ""; // clear line text
				break;
			case "load":
				document.getElementById("file_browser").click();
				terminal.line.text = ""; // clear line text
				break;
			case "look":
				print_buffer = "\t\n" + fileContents;
				terminal.print();
				terminal.line.text = ""; // clear line text
				break;
			case "about":
				terminal.print("Welcome to Jot. The app that allows you to pen down your ideas on the fly");
				break;
		}
	}
	else if (terminal.app == "game") {
		switch(command) {
			case "help":
				terminal.print("Commands:\nn, s, e, w, look, look *item*, i, inventory, take, drop, exit")
				terminal.line.text = ""; // clear line text
				break;
			case "exit":
				terminal.app = "";
				terminal.prompt.set("c:\\>");
				terminal.line.text = ""; // clear line text
				break;
		}
	}
	switch(command) {
		case "sound":
			terminal.line.text = "";
			if (args[1] == "off") {
				terminal.print("You turned off sound.");
				terminal.sound.enabled = false;
			}
			else if (args[1] == "on") {
				terminal.print("You turned on sound.");
				terminal.sound.enabled = true;
			}
			else {
				if (terminal.sound.enabled) terminal.print("Sound is currently turned on."); else terminal.print("Sound is currently turned off.");
			}
			break;
		case "voice":
			terminal.line.text = "";
			terminal.sound.speak("");
			if (args[1] == "off") {
				terminal.print("You turned off voice.");
				terminal.sound.voice_enabled = false;
			}
			else if (args[1] == "on") {
				terminal.print("You turned on voice.");
				terminal.sound.voice_enabled = true;
			}
			else {
				if (terminal.sound.voice_enabled) terminal.print("Voice is currently turned on."); else terminal.print("Voice is currently turned off.");
			}
			break;
	}
}
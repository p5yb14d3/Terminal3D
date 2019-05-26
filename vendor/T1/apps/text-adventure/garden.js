var garden = [];
garden[0] = function() {
	var title = "A lush outdoor garden";
	var description = "The warmth of the sun falls on the brick patio, radiating heat in the walled garden. The smell of vines and flowers permeate the air.";
	var exitsDescription = "An old oak door opens into the house to the (west).";
	var visited = false;
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};

	this.enter = function() {
		system.title(title);
		system.print("<strong>" + title + "</strong>");
		// system.print(description);
		// system.print(exitsDescription);
		system.print(description + "\n" + exitsDescription);
		visited = true;
	};
	this.west = function() {
		system.print("You enter the house.");
		system.print("");
		system.print("You blink as your eyes adjust to the darkness.");
		player.setPosition(0, 1);
		return true;
	};
	this.w = this.west;
	this.look = function(commandData) {
		if (commandData.length <= 0) {
			system.print("You look around.");
			system.print("");
			// system.print(description);
			// system.print(exitsDescription);
			system.print(description + "\n" + exitsDescription);
		}
		return false;
	};
	this.l = this.look;
};
var gardenItems = [];
gardenItems[0] = function() {
	this.keys = [ "flower", "pansy" ];
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};

	this.look = function(commandData) {
		if (commandData.length > 0 && system.in_array(commandData[0], this.keys)) {
			system.print("The small purple pansy looks limp.");
			return true;
		}
		if (commandData.length <= 0) {
			system.print("A small flower wilts on the ground.");
		}
		return false;
	};
	this.l = this.look;
	this.take = function(commandData) {
		if (system.in_array(commandData[0], this.keys)) {
			system.print("You carefully put the flower in your pocket.");
			system.print("");
			var item = world.takeItem(commandData[0], player.getPosition());
			player.giveItem(item);
			return true;
		}
		return false;
	};
	this.held = function() {
		system.print("a flower");
		return false;
	};
	this.drop = function(commandData) {
		if (system.in_array(commandData[0], this.keys)) {
			system.print("You let the flower fall to the floor.");
			system.print("");
			var item = player.takeItem(commandData[0]);
			world.giveItem(item, player.getPosition());
			return true;
		}
		return false;
	};
};
world.addZone(1, garden);
world.addItems(1, 0, gardenItems);

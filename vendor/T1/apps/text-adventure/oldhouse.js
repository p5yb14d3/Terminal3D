var oldhouse = [];
oldhouse[0] = function() {
	var title = "A sunny hallway";
	var description = "The sunlight streams in through the windows to the east, causing dust particles in the air to glimmer while drifting between the shafts of light.";
	var exitsDescription = "The hall continues to the (north). The great entry hall can be seen to the (south).";
	var visited = false;
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};
	this.enter = function() {
		system.title(title);
		system.print(title);
		// system.print(description);
		// system.print(exitsDescription);
		system.print(description + "\n" + exitsDescription);
		visited = true;
	};
	this.north = function() {
		system.print("You walk north.");
		// system.print("");
		player.setPosition(0, 1);
		return true;
	};
	this.n = this.north;

	this.south = function() {
		system.print("You walk south.");
		// system.print("");
		player.setPosition(0, 2);
		return true;
	};
	this.s = this.south;
	this.look = function(commandData) {
		if (commandData.length <= 0) {
			system.print("You look around.");
			// system.print("");
			// system.print(description);
			// system.print(exitsDescription);
			system.print(description + "\n" + exitsDescription);
		}
		return false;
	};
	this.l = this.look;
};
oldhouse[1] = function() {
	var title = "A darkened hallway";
	var description = "The heavy dark drapes over the eastern windows bring a sense of closeness to the hallway. The worn red carpet smells a little like mould.";
	var exitsDescription = "The hallway looks brighter to the (south). An open oak door to the (east) leads out into the garden. There is a large and well-lit room to the (north).";
	var visited = false;
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};
	this.enter = function() {
		system.title(title);
		system.print(title);
		// system.print(description);
		// system.print(exitsDescription);
		system.print(description + "\n" + exitsDescription);
		visited = true;
	};
	this.south = function() {
		system.print("You walk south.");
		// system.print("");
		player.setPosition(0, 0);
		return true;
	};
	this.s = this.south;
	this.east = function() {
		system.print("You walk through the door and out into the garden, blinking in the sudden harsh light.");
		// system.print("");
		player.setPosition(1, 0);
		return true;
	};
	this.e = this.east;

	this.north = function() {
		system.print("You walk north.");
		// system.print("");
		player.setPosition(0, 3);
		return true;
	};
	this.n = this.north;

	this.look = function(commandData) {
		if (commandData.length <= 0) {
			system.print("You look around.");
			// system.print("");
			// system.print(description);
			// system.print(exitsDescription);
			system.print(description + "\n" + exitsDescription);
		}
		return false;
	};
	this.l = this.look;
};
oldhouse[2] = function() {
	var title = "Entry Hall";
	var description = "The ceiling of the hall is vaulted, with the light streaming in through the stained glass windows casting colorful shadows across the worn carpet.";
	var exitsDescription = "A hallway extends to the (north). The door to the south does not look like it will open.";
	var visited = false;
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};
	this.enter = function() {
		system.title(title);
		system.print(title);
		// system.print(description);
		// system.print(exitsDescription);
		system.print(description + "\n" + exitsDescription);
		visited = true;
	};
	this.north = function() {
		system.print("You walk north.");
		// system.print("");
		player.setPosition(0, 0);
		return true;
	};
	this.n = this.north;

	this.look = function(commandData) {
		if (commandData.length <= 0) {
			system.print("You look around.");
			// system.print("");
			// system.print(description);
			// system.print(exitsDescription);
			system.print(description + "\n" + exitsDescription);
		}
		return false;
	};
	this.l = this.look;
};
oldhouse[3] = function() {
	var title = "Grand Ballroom";
	var description = "The polished marble floors echo with footsteps, augmenting the already voluminous size of the ballroom. In the center of the tremendous vaulted ceiling hangs an enormous crystal chandelier, casting sparkles of light across the ornately gilded walls.";
	var exitsDescription = "A hallway extends beneath an archway to the (south).";
	var visited = false;
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};
	this.enter = function() {
		system.title(title);
		system.print(title);
		system.print(description);
		system.print(exitsDescription);
		visited = true;
	};
	this.south = function() {
		system.print("You walk south.");
		// system.print("");
		player.setPosition(0, 1);
		return true;
	};
	this.s = this.south;

	this.look = function(commandData) {
		if (commandData.length <= 0) {
			system.print("You look around.");
			// system.print("");
			system.print(description);
			system.print(exitsDescription);
		}
		return false;
	};
	this.l = this.look;
};

var ballroomItems = [];
ballroomItems[0] = function() {
	var viewed = false;
	this.keys = [ "pearl", "bead" ];
	this.actions = function(command, commandData) {
		if (typeof (this[command]) == "function") {
			return this[command](commandData);
		}
		return false;
	};

	this.look = function(commandData) {
		if (commandData.length > 0 && system.in_array(commandData[0], this.keys)) {
			system.print("It is a shiny, opalescent pearl.");
			viewed = true;
			return true;
		}
		if (commandData.length <= 0) {
			if (viewed) {
				system.print("A perfect white pearl sits on the floor.");
			} else {
				system.print("A tiny white bead sits on the floor.");
			}
		}
		return false;
	};
	this.l = this.look;
	this.take = function(commandData) {
		if (system.in_array(commandData[0], this.keys)) {
			if (viewed) {
				system.print("You take the pearl.");
			} else {
				system.print("You take the bead.");
			}
			// system.print("");
			var item = world.takeItem(commandData[0], player.getPosition());
			player.giveItem(item);
			return true;
		}
		return false;
	};
	this.held = function() {
		if (viewed) {
			system.print("a pearl");
		} else {
			system.print("a bead");
		}
		return false;
	};
	this.drop = function(commandData) {
		if (system.in_array(commandData[0], this.keys)) {
			if (viewed) {
				system.print("You drop the pearl, letting it bounce across the floor to a stop.");
			} else {
				system.print("You drop the bead, letting it bounce across the floor to a stop.");
			}
			// system.print("");
			var item = player.takeItem(commandData[0]);
			world.giveItem(item, player.getPosition());
			return true;
		}
		return false;
	};
};

world.addZone(0, oldhouse);
world.addItems(0, 3, ballroomItems);

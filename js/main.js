// --- OBJECTS ---
class Todo {
	constructor() {
		this.id = 0;
		this.tasks = {
			daily: [],
			weekly: [],
		};
	}

	// Getters and setters
	getID() {
		return this.id;
	}
	setID(id) {
		this.id = id;
	}
	getTasks() {
		return this.tasks;
	}
	getDailyTasks() {
		return this.tasks.daily;
	}
	getWeeklyTasks() {
		return this.tasks.weekly;
	}

	// Adding new tasks
	addDailyTask(task) {
		task.setID;
		this.tasks.daily.push(task);
	}
	addWeeklyTask(task) {
		this.tasks.weekly.push(task);
	}
	removeDailyTask(target_task) {
		const tasks = this.getDailyTasks();
		const task_index = tasks.findIndex((task) => task.equals(target_task));

		this.tasks.daily.splice(task_index, 1);
		UpdateLocalStorage(account);

		PopulateCarousel(account);
	}
	resetDailyTasks() {
		this.tasks['daily'].forEach((task) => (task.count_progress = 0));
	}
	resetWeeklyTasks() {
		this.tasks['weekly'].forEach((task) => (task.count_progress = 0));
	}
	resetAllTasks() {
		this.resetDailyTasks();
		this.resetWeeklyTasks();
	}
}
class Account extends Todo {
	/**
	 * Creates a new account.
	 */
	constructor() {
		super();
		this.last_visited = Math.floor(Date.now() / 1000);
		this.characters = {};
		this.id_count = 0;
	}

	// Getters
	getLastVisited() {
		return this.last_visited;
	}
	getCharacters() {
		return this.characters;
	}

	updateLastVisited() {
		this.last_visited = Math.floor(Date.now() / 1000);
		UpdateLocalStorage(this);
	}
	addCharacter(character) {
		character.setID(++this.id_count);
		character.setOrder(this.id_count);
		this.characters[this.id_count] = character;
		UpdateLocalStorage(this);

		PopulateCarousel(this);
	}

	// Adds rapport tasks, chaos gate, adventure island, and ghost ship
	createDefaultTasks() {
		this.addDailyTask(new Task('Rapport: Play Instrument', 5, 0));
		this.addDailyTask(new Task('Rapport: Emote', 5, 0));
		this.addDailyTask(new Task('Chaos Gate', 1, 0));
		this.addDailyTask(new Task('Adventure Island', 1, 0));
		this.addWeeklyTask(new Task('Ghost Ship', 1, 0));
	}
}
class Character extends Todo {
	/**
	 * Create a new character.
	 * @param {string} char_name The name of the character
	 */
	constructor(char_name, job) {
		super();
		this.char_name = char_name;
		this.job = job;
		this.order = 0;
	}

	// Getters and setters
	getName() {
		return this.char_name;
	}
	setName(char_name) {
		this.char_name = char_name;
	}
	getClass() {
		return this.job;
	}
	setClass(job) {
		this.job = job;
	}
	getOrder() {
		return this.order;
	}
	setOrder(order) {
		this.order = order;
	}

	// Adds Una's tasks, Chaos Dungeons, and Guardian Raids daily tasks
	createDefaultTasks() {
		this.addDailyTask(new Task("Una's Tasks", 3, 0));
		this.addDailyTask(new Task('Chaos Dungeons', 2, 0));
		this.addDailyTask(new Task('Guardian Raids', 2, 0));
	}
}
class Task {
	/**
	 * Creates a new task.
	 * @param {string} title Content of the task
	 * @param {int} count_total Maximum number of completions required
	 * @param {int} count_progress Current number of completions
	 */
	constructor(title, count_total, count_progress = 0) {
		this.title = title;
		this.count_total = count_total;
		this.count_progress = count_progress || 0;
	}

	// Getters and setters
	getTitle() {
		return this.title;
	}
	setTitle(title) {
		this.title = title;
		UpdateLocalStorage(this);
	}
	getCountTotal() {
		return this.count_total;
	}
	setCountTotal(count_total) {
		this.count_total = count_total;
		UpdateLocalStorage(this);
	}
	getCountProgress() {
		return this.count_progress;
	}
	setCountProgress(count_progress) {
		this.count_progress = count_progress;
		UpdateLocalStorage(account);
	}

	incrementCount() {
		if (this.count_progress < this.count_total) {
			this.count_progress++;
		}
		UpdateLocalStorage(account);
	}
	decrementCount() {
		if (this.count_progress > 0) this.count_progress--;
		UpdateLocalStorage(account);
	}
	equals(target_task) {
		return (
			this.title == target_task.title &&
			this.count_total == target_task.count_total &&
			this.count_progress == target_task.count_progress
		);
	}
}

// --- HELPER FUNCTIONS ---
const UpdateLocalStorage = (obj) => {
	local_storage.setItem('account', JSON.stringify(obj));
};
/**
 * Resets all daily tasks to have count_progress of 0.
 * @param {Account} obj Stored account data
 */
const ResetDailyTasks = (obj) => {
	// Reset accoutn dailies
	obj.resetDailyTasks();
	// Reset characters dailies
	Object.keys(obj.characters).forEach((id) => {
		obj.characters[id].resetDailyTasks();
	});

	// Update progress bars
	document.querySelectorAll('.task.daily').forEach((task) => {
		task.querySelector('progress').value = 0;
	});

	UpdateLocalStorage(account);
};
/**
 * Resets all weekly tasks to have count_progress of 0.
 * @param {Account} obj Stored account data
 */
const ResetWeeklyTasks = (obj) => {
	// Reset account weeklies
	obj.resetWeeklyTasks();
	// Reset characters weeklies
	Object.keys(obj.characters).forEach((id) => {
		obj.characters[id].resetWeeklyTasks();
	});

	// Update progress bars
	document.querySelectorAll('.task.weekly').forEach((task) => {
		task.querySelector('progress').value = 0;
	});

	UpdateLocalStorage(account);
};

/**
 * Corrects prototype of object stored in local storage to Account prototype.
 * @returns Corrected Account object
 */
const ParseJSON = () => {
	const parse = JSON.parse(local_storage.getItem('account'));
	// Assign Account prototype to saved account
	let fixed_parse = Object.assign(new Account(), parse);
	// Assign Character prototypes to saved characters
	ParseJSONCharacters(parse, fixed_parse);
	// Assign Task prototypes to saved tasks
	ParseJSONTasks(parse, fixed_parse);

	return fixed_parse;
};
/**
 * Corrects saved characters to Character prototype.
 * @param {Object} parse Parsed saved data from local storage.
 * @param {Account} fixed_parse Parsed data converted to correct prototypes.
 */
const ParseJSONCharacters = (parse, fixed_parse) => {
	// Loop through each character and assign Character prototype.
	Object.keys(parse.characters).forEach((id) => {
		fixed_parse.characters[id] = Object.assign(new Character(), parse.characters[id]);
		ParseJSONTasks(fixed_parse.characters[id], parse.characters[id]);
	});
};
/**
 * Corrects saved tasks to Task prototype.
 * @param {Object} parse Parsed saved data from local storage.
 * @param {Account} fixed_parse Parsed data converted to correct prototypes.
 */
const ParseJSONTasks = (parse, fixed_parse) => {
	// Loop through each task and assign Task prototype
	Object.keys(parse.tasks).forEach((view) => {
		parse.tasks[view].forEach((task, i) => {
			fixed_parse.tasks[view][i] = Object.assign(new Task(), task);
		});
	});
};

/**
 * Takes data from Account and generates cards to populate carousel.
 * @param {Account} obj
 */
const PopulateCarousel = (obj) => {
	const carousel = document.querySelector('.card-carousel');

	carousel.innerHTML = GenerateCreateCardHTML();
	carousel.innerHTML += GenerateAccountCardHTML(obj);
	Object.keys(obj.characters).forEach((id) => {
		carousel.innerHTML += GenerateCharacterCardHTML(account.characters[id]);
	});

	// Enable interactions with tasks
	HandleTasks(obj);
	// Enable toggling of Daily and Weekly tasks
	HandleViews(obj);
	// Enable user to create new characters and tasks
	HandleCreateButtons(obj);
};
const GenerateCreateCardHTML = () => {
	return `
    <!-- Add new character card -->
    <li class="create-card btn create">
      <span class="add-decoration"></span>
    </li>
  `;
};
const GenerateAccountCardHTML = (obj) => {
	return `
    <li class="card account">
      <section class="profile bg logo">
        <i class="fas fa-edit"></i>
      </section>
      ${GenerateTodoList(obj)}
    </li>
  `;
};
const GenerateCharacterCardHTML = (obj) => {
	return `
    <li class="card character">
      <section class="profile bg ${obj.getClass()}">
        <i class="fas fa-edit"></i>
        <h2 class="name">${obj.getName()}</h2>
      </section>
      ${GenerateTodoList(obj)}
    </li>
  `;
};
const GenerateTodoList = (obj) => {
	return `
    <section>
      <ul class="todo-list">
        <li class="create-task create btn add-decoration"></li>
        ${PopulateTasks(obj)}
      </ul>
    </section>
  `;
};
const PopulateTasks = (obj) => {
	const daily = obj.getDailyTasks();
	const weekly = obj.getWeeklyTasks();

	return [GenerateTasksHTML('daily', daily, obj.getID()), GenerateTasksHTML('weekly', weekly, obj.getID())].join('');
};
const GenerateTasksHTML = (view, tasks, id) => {
	return tasks
		.map((task) => {
			return `
      <li class="task ${view} ${task.count_progress === task.count_total ? 'complete' : ''}" data-card-id="${id}">
        <p>${task.title}</p>
        <progress max="${task.count_total}" value="${task.count_progress}"></progress>
      </li>
    `;
		})
		.join('');
};

/**
 * Adds event listeners to tasks for updating progress.
 * @param {Account} obj
 */
const HandleTasks = (obj) => {
	const tasks = document.querySelectorAll('.task');
	tasks.forEach((task) => {
		if (!task.getAttribute('listener')) {
			task.addEventListener('click', HandleTaskEvents.bind(event, obj, task));
			task.setAttribute('listener', true);
		}
	});
};
const HandleTaskEvents = (obj, task, e) => {
	const view = document.querySelector('.tasks-view').querySelector('.active').textContent.toLowerCase();
	const progress_bar = task.querySelector('progress');
	const card_id = task.dataset.cardId;
	const target_task = HTMLtoTask(task);

	const tasks = card_id > 0 ? obj.characters[card_id].tasks[view] : obj.tasks[view];
	const task_index = FindTaskIndex(tasks, target_task);

	if (!e.altKey) {
		if (progress_bar.value < progress_bar.max) {
			tasks[task_index].incrementCount();
			progress_bar.value++;
			if (progress_bar.value == progress_bar.max) {
				task.classList.add('complete');
			}
		}
	} else {
		if (progress_bar.value > 0) {
			tasks[task_index].decrementCount();
			progress_bar.value--;
			task.classList.remove('complete');
		}
	}

	UpdateLocalStorage(obj);
};
const HTMLtoTask = (element) => {
	return new Task(
		element.querySelector('p').textContent,
		element.querySelector('progress').max,
		element.querySelector('progress').value
	);
};
const FindTaskIndex = (obj, target_task) => {
	return obj.findIndex((task) => task.equals(target_task));
};

/**
 * Adds event listeners to Daily and Weekly toggle.
 */
const HandleViews = () => {
	const views = document.querySelectorAll('.view');

	views.forEach((view) => {
		view.addEventListener('click', (e) => {
			views.forEach((i) => {
				if (e.target != i) {
					i.classList.remove('active');
					HideTasks(i.querySelector('p').textContent.toLowerCase());
				}
			});

			view.classList.add('active');
			ShowTasks(view.querySelector('p').textContent.toLowerCase());
		});
	});

	document.querySelector('.view.daily').click();
};
const HideTasks = (view) => {
	const tasks = document.querySelectorAll(`.task.${view}`);
	tasks.forEach((task) => {
		task.classList.add('hide');
	});
};
const ShowTasks = (view) => {
	const tasks = document.querySelectorAll(`.task.${view}`);
	tasks.forEach((task) => {
		task.classList.remove('hide');
	});
};

/**
 * Updates timers and resets tasks progress if needed.
 * @param {Account} obj
 */
const HandleTimer = (obj) => {
	const daily_timer = document.querySelector('.timer.daily').querySelector('.timer');
	const weekly_timer = document.querySelector('.timer.weekly').querySelector('.timer');

	// Resets at the 36000 second of the day ; 5AM UTC-5
	const RESET_TIME = 36000;
	// 86400 seconds in a day
	const day_seconds = 86400;
	// 604800 seconds in a week
	const week_seconds = 604800;

	setInterval(() => {
		// obj.updateLastVisited();
		// UpdateLocalStorage(obj);

		const now = Math.floor(Date.now() / 1000);
		const now_relative_daily = now % day_seconds;
		const now_relative_weekly = now % week_seconds;

		const time_remaining_daily = TimeRemainingConvert(RESET_TIME, now_relative_daily, day_seconds);
		const time_remaining_weekly = TimeRemainingConvert(RESET_TIME, now_relative_weekly, week_seconds);

		if (time_remaining_daily == 0) {
			ResetDailyTasks(obj);
		}
		if (time_remaining_weekly == 0) {
			ResetWeeklyTasks(obj);
		}

		//
		const time_remaining_seconds = TimeStringConvert(time_remaining_daily % 60);
		const time_remaining_minutes = TimeStringConvert(Math.floor(time_remaining_daily / 60) % 60);
		const time_remaining_hours = TimeStringConvert(Math.floor(time_remaining_daily / 3600) % 24);
		const time_remaining_days = Math.floor(time_remaining_weekly / day_seconds);

		daily_timer.innerHTML = `
      ${time_remaining_hours}:${time_remaining_minutes}:${time_remaining_seconds}
    `;
		weekly_timer.innerHTML = `
      ${time_remaining_days}:${time_remaining_hours}:${time_remaining_minutes}:${time_remaining_seconds}
    `;
	}, 1000);
};
const TimeRemainingConvert = (reset_time, time, constraint) => {
	return time > reset_time ? constraint - time + reset_time : reset_time - time;
};
const TimeStringConvert = (time) => {
	return time < 10 ? '0' + time : time;
};

const HandleCreateButtons = (obj) => {
	const modal = document.querySelector('#modal');
	const create_character = document.querySelector('.create-character-form');
	const create_btns = document.querySelectorAll('.create.btn');

	create_btns.forEach((btn) => {
		// User is creating a character
		if (btn.classList.contains('create-card')) {
			btn.addEventListener('click', () => {
				modal.querySelector('.exit').addEventListener('click', () => {
					modal.classList.remove('open');
					create_character.classList.add('hide');
				});

				create_character.classList.remove('hide');
				modal.classList.add('open');
			});
		}
		// User is creating a task
		else {
		}
	});
};

const HandleCreateCharacterForm = (obj) => {
	const create_character_form = document.querySelector('.create-character-form form');
	create_character_form.addEventListener('submit', (e) => {
		e.preventDefault();

		const new_character_name = create_character_form.elements['character-name'].value;
		const new_character_class = create_character_form.elements['class-select'].value;

		modal.classList.remove('open');
		const new_character = new Character(new_character_name, new_character_class);
		new_character.createDefaultTasks();
		account.addCharacter(new_character);

		create_character_form.reset();
	});
};

// --- MAIN ---
const local_storage = window.localStorage;
// Generate new account if first visit
if (local_storage.getItem('account') === null) {
	const new_account = new Account();
	new_account.createDefaultTasks();
	UpdateLocalStorage(new_account);
}
// Grab data on LocalStorage
const account = ParseJSON();

// Populate card carousel with account and character cards
PopulateCarousel(account);
// Begins countdown timers
HandleTimer(account);
// Enables submission of add character form
HandleCreateCharacterForm(account);

// Update LocalStorage before exiting
// window.onbeforeunload = () => {
// 	account.updateLastVisited();
// 	UpdateLocalStorage(account);
// };

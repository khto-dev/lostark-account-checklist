// --- GLOBAL VARIABLES ---
const local_storage = window.localStorage;
const session_storage = window.sessionStorage;
let account = local_storage.getItem('account');
const class_list = [
	'berserker',
	'gunlancer',
	'paladin',
	'glaivier',
	'scrapper',
	'soulfist',
	'striker',
	'wardancer',
	'artillerist',
	'deadeye',
	'gunslinger',
	'sharpshooter',
	'bard',
	'sorceress',
	'deathblade',
	'shadowhunter',
];

// --- OBJECTS ---
class Todo {
	constructor() {
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
		this.tasks.daily[this.tasks.daily.length] = task;

		UpdateLocalStorage();
		PopulateCarousel();
	}
	addWeeklyTask(task) {
		this.tasks.weekly[this.tasks.weekly.length] = task;

		UpdateLocalStorage();
		PopulateCarousel();
	}
	removeDailyTask(index) {
		this.tasks.daily.splice(index, 1);

		UpdateLocalStorage();
		PopulateCarousel();
	}
	removeWeeklyTask(index) {
		this.tasks.weekly.splice(index, 1);

		UpdateLocalStorage();
		PopulateCarousel();
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
		this.last_visited = GetNowUTCTimestamp();
		this.characters = [];
	}

	// Getters
	getLastVisited() {
		return this.last_visited;
	}
	getCharacters() {
		return this.characters;
	}

	updateLastVisited() {
		this.last_visited = GetNowUTCTimestamp();
	}
	addCharacter(character) {
		this.characters[this.characters.length] = character;

		UpdateLocalStorage();
		PopulateCarousel();
	}
	removeCharacter(key) {
		// delete this.characters[key];
		this.characters.splice(key, 1);

		UpdateLocalStorage();
		PopulateCarousel();
	}

	// Adds rapport tasks, chaos gate, adventure island, and ghost ship
	createDefaultTasks() {
		this.addDailyTask(new Task('Rapport: Play Instrument', 6));
		this.addDailyTask(new Task('Rapport: Emote', 6));
		this.addDailyTask(new Task('Chaos Gate', 1));
		this.addDailyTask(new Task('Field Boss', 1));
		this.addDailyTask(new Task('Adventure Island', 1));
		this.addWeeklyTask(new Task('Ghost Ship', 1));
	}
}
class Character extends Todo {
	/**
	 * Create a new character.
	 * @param {string} char_name The name of the character
	 * @param {string} job The character's class
	 */
	constructor(char_name, job) {
		super();
		this.char_name = char_name;
		this.job = job;
	}

	// Getters and setters
	getName() {
		return this.char_name;
	}
	setName(char_name) {
		this.char_name = char_name;

		UpdateLocalStorage();
		PopulateCarousel();
	}
	getClass() {
		return this.job;
	}
	setClass(job) {
		this.job = job;

		UpdateLocalStorage();
	}
	getOrder() {
		return this.order;
	}
	setOrder(order) {
		this.order = order;

		UpdateLocalStorage();
	}

	// Adds Una's tasks, Chaos Dungeons, and Guardian Raids daily tasks
	createDefaultTasks() {
		this.addDailyTask(new Task("Una's Tasks", 3));
		this.addDailyTask(new Task('Chaos Dungeons', 2));
		this.addDailyTask(new Task('Guardian Raids', 2));
		this.addWeeklyTask(new Task("Una's Tasks", 3));
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

		UpdateLocalStorage();
		PopulateCarousel();
	}
	getCountTotal() {
		return this.count_total;
	}
	setCountTotal(count_total) {
		this.count_total = count_total;

		UpdateLocalStorage();
		PopulateCarousel();
	}
	getCountProgress() {
		return this.count_progress;
	}
	setCountProgress(count_progress) {
		this.count_progress = count_progress;

		UpdateLocalStorage();
		PopulateCarousel();
	}

	incrementCount() {
		if (this.count_progress < this.count_total) {
			this.count_progress++;
		}

		UpdateLocalStorage();
	}
	decrementCount() {
		if (this.count_progress > 0) this.count_progress--;

		UpdateLocalStorage();
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
const UpdateLocalStorage = () => {
	account.updateLastVisited();
	local_storage.setItem('account', JSON.stringify(account));
};
const GetNowUTCTimestamp = () => {
	return Math.floor(new Date().getTime() / 1000);
};
/**
 * Resets all daily tasks to have count_progress of 0.
 */
const ResetDailyTasks = () => {
	// Reset accoutn dailies
	account.resetDailyTasks();
	// Reset characters dailies
	Object.keys(account.characters).forEach((id) => {
		account.characters[id].resetDailyTasks();
	});

	// Update progress bars
	document.querySelectorAll('.task.daily').forEach((task) => {
		task.querySelector('progress').value = 0;
		task.classList.remove('complete');
	});

	UpdateLocalStorage();
};
/**
 * Resets all weekly tasks to have count_progress of 0.
 */
const ResetWeeklyTasks = () => {
	// Reset account weeklies
	account.resetWeeklyTasks();
	// Reset characters weeklies
	Object.keys(account.characters).forEach((id) => {
		account.characters[id].resetWeeklyTasks();
	});

	// Update progress bars
	document.querySelectorAll('.task.weekly').forEach((task) => {
		task.querySelector('progress').value = 0;
		task.classList.remove('complete');
	});

	UpdateLocalStorage();
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
	if (!Array.isArray(parse.characters)) {
		fixed_parse.characters = Object.keys(parse.characters).map((character) => {
			return parse.characters[character];
		});
		fixed_parse.characters.forEach((character, i) => {
			fixed_parse.characters[i] = Object.assign(new Character(), character);
			console.log(i, fixed_parse);
			ParseJSONTasks(fixed_parse.characters[i]);
		});
	} else {
		parse.characters.forEach((character, i) => {
			fixed_parse.characters[i] = Object.assign(new Character(), character);
			ParseJSONTasks(parse.characters[i], fixed_parse.characters[i]);
		});
	}
};
/**
 * Corrects saved tasks to Task prototype.
 * @param {Object} parse Parsed saved data from local storage.
 * @param {Account} fixed_parse Parsed data converted to correct prototypes.
 */
const ParseJSONTasks = (fixed_parse) => {
	// Loop through each task and assign Task prototype
	Object.keys(fixed_parse.tasks).forEach((view) => {
		fixed_parse.tasks[view].forEach((task, i) => {
			fixed_parse.tasks[view][i] = Object.assign(new Task(), task);
		});
	});
};

/**
 * Takes data from Account and generates cards to populate carousel.
 */
const PopulateCarousel = () => {
	const carousel = document.querySelector('.card-carousel');

	carousel.innerHTML = GenerateCreateCardHTML();
	carousel.innerHTML += GenerateAccountCardHTML();

	account.characters.forEach((character, i) => {
		carousel.innerHTML += GenerateCharacterCardHTML(character, i + 1);
	});

	// Enable interactions with tasks
	HandleTasks();
	// Enable toggling of Daily and Weekly tasks
	HandleViews();
	// Enables create and edit functionalities
	GenerateModal();
};
const GenerateCreateCardHTML = () => {
	return `
    <!-- Add new character card -->
    <li class="create-card card btn create">
      <span class="add-decoration"></span>
    </li>
  `;
};
const GenerateAccountCardHTML = () => {
	return `
    <li class="card account" data-card-id=0>
      <section class="profile bg logo">
        <i class="fas fa-edit" data-card-id=0></i>
      </section>
      ${GenerateTodoList(account, 0)}
    </li>
  `;
};
const GenerateCharacterCardHTML = (character, index) => {
	return `
    <li class="card character" data-card-id=${index}>
      <section class="profile bg ${character.getClass()}">
        <i class="fas fa-edit" data-card-id=${index}></i>
        <h2 class="name">${character.getName()}</h2>
      </section>
      ${GenerateTodoList(character, index)}
    </li>
  `;
};
const GenerateTodoList = (obj, index) => {
	return `
    <section>
      <ul class="todo-list">
        <li class="create-task create btn add-decoration" data-card-id="${index}"></li>
        ${PopulateTasks(obj, index)}
      </ul>
    </section>
  `;
};
const PopulateTasks = (obj, index) => {
	const daily = obj.getDailyTasks();
	const weekly = obj.getWeeklyTasks();

	return [GenerateTasksHTML('daily', daily, index), GenerateTasksHTML('weekly', weekly, index)].join('');
};
const GenerateTasksHTML = (view, tasks, index) => {
	return tasks
		.map((task) => {
			return `
      <li class="task ${view} ${task.count_progress == task.count_total ? 'complete' : ''}" data-card-id="${index}">
        <p>${task.title}</p>
        <progress max="${task.count_total}" value="${task.count_progress}"></progress>
      </li>
    `;
		})
		.join('');
};

/**
 * Adds event listeners to tasks for updating progress.
 */
const HandleTasks = () => {
	const tasks = document.querySelectorAll('.task');
	tasks.forEach((task) => {
		if (!task.getAttribute('listener')) {
			task.addEventListener('click', HandleTaskEvents.bind(event, task));
			task.setAttribute('listener', true);
		}
	});
};
const HandleTaskEvents = (task, e) => {
	const view = document.querySelector('.tasks-view').querySelector('.active').textContent.toLowerCase();
	const progress_bar = task.querySelector('progress');
	const card_id = task.dataset.cardId;
	const target_task = HTMLtoTask(task);

	const tasks = card_id > 0 ? account.characters[card_id - 1].tasks[view] : account.tasks[view];
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

	UpdateLocalStorage();
};
const HTMLtoTask = (element) => {
	return new Task(
		element.querySelector('p').textContent,
		element.querySelector('progress').max,
		element.querySelector('progress').value
	);
};
const FindTaskIndex = (task_list, target_task) => {
	return task_list.findIndex((task) => task.equals(target_task));
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
 */
const HandleTimer = () => {
	const daily_timer = document.querySelector('.timer.daily').querySelector('.timer');
	const weekly_timer = document.querySelector('.timer.weekly').querySelector('.timer');

	// Resets at the 36000 second of the day ; 10AM UTC
	const RESET_TIME = 36000;
	// 86400 seconds in a day
	const day_seconds = 86400;
	// 604800 seconds in a week
	const week_seconds = 604800;

	const now = GetNowUTCTimestamp();

	CheckForReset(now, account.getLastVisited());

	UpdateLocalStorage();

	setInterval(() => {
		const now = GetNowUTCTimestamp();
		const now_relative_daily = now % day_seconds;
		const now_relative_weekly = now % week_seconds;

		const time_remaining_daily = TimeRemainingConvert(RESET_TIME, now_relative_daily, day_seconds);
		const time_remaining_weekly = TimeRemainingConvert(RESET_TIME, now_relative_weekly, week_seconds);

		if (time_remaining_daily == 0) {
			ResetDailyTasks();
		}
		if (time_remaining_weekly == 0) {
			ResetWeeklyTasks();
		}

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
const CheckForReset = (current_time, compare_time) => {
	// Server reset time
	const reset_time = 36000;
	// 86400 seconds in a day
	const day_seconds = 86400;
	// 604800 seconds in a week
	const week_seconds = 604800;

	console.table({
		current_time: current_time,
		current_time_relative_weekly: current_time % week_seconds,
		current_time_relative_daily: current_time % day_seconds,
		last_activity: compare_time,
		last_activity_relative_weekly: compare_time % week_seconds,
		last_activity_relative_daily: compare_time % day_seconds,
	});
	console.log('Checking for reset...');
	console.log(`- Last visit longer than a week: ${current_time - compare_time > week_seconds}`);
	console.log(
		`- Weekly reset occurred between last activity and current time: ${
			compare_time % week_seconds < reset_time && current_time % week_seconds > reset_time
		}`
	);
	console.log(`- Last visit longer than a day: ${current_time - compare_time > day_seconds}`);
	console.log(
		`- Daily reset occurred between last activity and current time: ${
			compare_time % day_seconds < reset_time && current_time % day_seconds > reset_time
		}`
	);

	// Reset everything if it has been more than 1 week since last visit
	if (
		current_time - compare_time > week_seconds ||
		(compare_time % week_seconds < reset_time && current_time % week_seconds > reset_time)
	) {
		ResetWeeklyTasks();
		ResetDailyTasks();
	}
	// Reset dailies if it has been more than 1 day since last visit
	else if (
		current_time - compare_time > day_seconds ||
		(compare_time % day_seconds < reset_time && current_time % day_seconds > reset_time)
	) {
		ResetDailyTasks();
	}

	UpdateLocalStorage();
};
const TimeRemainingConvert = (reset_time, time, constraint) => {
	return time > reset_time ? constraint - time + reset_time : reset_time - time;
};
const TimeStringConvert = (time) => {
	return time < 10 ? '0' + time : time;
};

const GenerateModal = () => {
	const modal = document.querySelector('#modal');
	// modal.replaceWith(modal.cloneNode(true));
	modal.innerHTML = `
  <div class="modal-bg exit"></div>
  ${GenerateCreateCharacterForm()}
  ${GenerateCreateTaskForm()}
  ${GenerateEditForm()}
  `;
	HandleCreateButtons();
	HandleCreateCharacterSubmit();
	HandleCreateTaskSubmit();
	HandleEditButtons();
};
const GenerateCreateCharacterForm = () => {
	return `  
    <div class="create-character-form hide">
      <form>
        <input type="text" name="character-name" maxlength="16" placeholder="Character Name" required />

        <p>Select your character's class.</p>
        <section class="class-selection">
          ${class_list
						.map((job) => {
							return GenerateClassButtonHTML(job);
						})
						.join('')}
        </section>
        <input type="submit" value="Add Character" />
      </form>
    </div>
  `;
};
const GenerateClassButtonHTML = (job) => {
	return `
    <label>
      <input type="radio" name="class-select" value="${job}" required />
      <section>
      <img src="img/class_icons/${job}.webp" />
        <p>${job[0].charAt(0).toUpperCase() + job.substring(1)}</p>
      </section>
    </label>
  `;
};
const GenerateCreateTaskForm = () => {
	return `
    <div class="create-task-form hide">
      <form>
        <input type="text" name="task-title" placeholder="Task Description" required />
        <input type="number" name="task-count" placeholder="Count" min="1" step="1" required />
        <p>* Count represents the maximum number of completions allotted before reset.</p>
        <input type="submit" value="Add Task" />
      </form>
    </div>
  `;
};

const GenerateEditForm = () => {
	return `
    <div class="edit-obj hide">
      <form>
        <input type="text" class="name-edit" name="character-name" maxlength="16" value="" placeholder="New Character Name" required />
        <section class="tasks-edit">
          <p>Dailies</p>
          <div class="daily-edit"></div>
          <p>Weeklies</p>
          <div class="weekly-edit"></div>
        </section>
        <section class="row">
          <input id="edit-apply-btn" type="submit" name="apply-btn" value="Apply Changes">
          <input id="edit-delete-btn" type="submit" name="delete-btn" value="Remove Character">
        </section>
      </form>
    </div>
  `;
};
const PopulateEditForm = () => {
	const edit_obj = document.querySelector('#modal .edit-obj');
	const edit_obj_form = edit_obj.querySelector('form');
	// Find which card to edit
	const card_id = edit_obj.dataset.cardId;
	const target = card_id > 0 ? account.characters[card_id - 1] : account;
	// Fill in object name
	const name_edit = edit_obj_form.querySelector('.name-edit');
	if (card_id > 0) {
		edit_obj_form.querySelector('#edit-delete-btn').removeAttribute('disabled');
		name_edit.removeAttribute('disabled');
		name_edit.setAttribute('value', target.getName());
	} else {
		name_edit.setAttribute('value', 'Account');
		name_edit.setAttribute('disabled', true);
		edit_obj_form.querySelector('#edit-delete-btn').setAttribute('disabled', true);
	}
	// Fill in object tasks
	PopulateEditDailies(target);
	PopulateEditWeeklies(target);
	HandleEditCheckboxes();
	HandleEditSubmit();
};
const PopulateEditDailies = (obj) => {
	const daily_edit = document.querySelector('#modal .edit-obj .daily-edit');

	daily_edit.innerHTML = obj.tasks.daily
		.map((task, index) => {
			return `
      <section class="row">
        <input type="checkbox" name="daily-task-${index}" data-card-id=${obj.getID()} data-task-index=${index} checked />
        <input type="text" name="daily-task-${index}-title" value="${task.getTitle()}" placeholder="Task Title" required />
        <input type="number" name="daily-task-${index}-count" value="${task.getCountTotal()}" placeholder="Count" required />
      </section>
    `;
		})
		.join('');
};
const PopulateEditWeeklies = (obj) => {
	const weekly_edit = document.querySelector('#modal .edit-obj .weekly-edit');

	weekly_edit.innerHTML = obj.tasks.weekly
		.map((task, index) => {
			return `
      <section class="row">
        <input type="checkbox" name="weekly-task-${index}" data-card-id=${obj.getID()} data-task-index=${index} checked />
        <input type="text" name="weekly-task-${index}-title" value="${task.getTitle()}" placeholder="Task Title" required />
        <input type="number" name="weekly-task-${index}-count" value="${task.getCountTotal()}" placeholder="Count" required />
      </section>
    `;
		})
		.join('');
};

const HandleCreateButtons = () => {
	const modal = document.querySelector('#modal');
	// Character Elements
	const create_character = document.querySelector('.create-card.btn');
	const create_character_form = document.querySelector('.create-character-form');
	// Task Elements
	const create_tasks = document.querySelectorAll('.create-task.btn');
	const create_task_form = document.querySelector('.create-task-form');
	// Edit Elements
	const edit_btns = document.querySelectorAll('.profile i');
	const edit_obj = document.querySelector('.edit-obj');

	create_character.addEventListener('click', () => {
		modal.querySelector('.exit').addEventListener('click', () => {
			modal.classList.remove('open');
			create_character_form.classList.add('hide');
		});

		modal.classList.add('open');
		create_character_form.classList.remove('hide');
	});

	create_tasks.forEach((create_task) => {
		create_task.addEventListener('click', (e) => {
			create_task_form.dataset.cardId = e.target.dataset.cardId;
			modal.querySelector('.exit').addEventListener('click', () => {
				modal.classList.remove('open');
				create_task_form.classList.add('hide');
			});

			modal.classList.add('open');
			create_task_form.classList.remove('hide');
		});
	});

	edit_btns.forEach((edit_btn) => {
		edit_btn.addEventListener('click', (e) => {
			edit_obj.dataset.cardId = e.target.dataset.cardId;
			modal.querySelector('.exit').addEventListener('click', () => {
				modal.classList.remove('open');
				edit_obj.classList.add('hide');
			});

			modal.classList.add('open');
			edit_obj.classList.remove('hide');
		});
	});
};
const HandleCreateCharacterSubmit = () => {
	const modal = document.querySelector('#modal');
	const create_character_form = document.querySelector('.create-character-form');

	create_character_form.addEventListener('submit', (e) => {
		e.preventDefault();

		const new_character = new Character(
			create_character_form.querySelector('form').elements['character-name'].value,
			create_character_form.querySelector('form').elements['class-select'].value
		);

		// Hide modal content
		modal.classList.remove('open');
		create_character_form.classList.add('hide');
		create_character_form.querySelector('form').reset();

		new_character.createDefaultTasks();

		account.addCharacter(new_character);
	});
};
const HandleCreateTaskSubmit = () => {
	const modal = document.querySelector('#modal');
	const create_task_form = document.querySelector('.create-task-form');

	create_task_form.addEventListener('submit', (e) => {
		e.preventDefault();

		const card_id = create_task_form.dataset.cardId;
		const view = document.querySelector('.tasks-view .active');

		const new_task = new Task(
			create_task_form.querySelector('form').elements['task-title'].value,
			create_task_form.querySelector('form').elements['task-count'].value
		);

		const target_obj = card_id > 0 ? account.characters[card_id - 1] : account;

		// Hide modal content
		modal.classList.remove('open');
		create_task_form.classList.add('hide');
		create_task_form.querySelector('form').reset();

		view.textContent.toLowerCase() == 'daily' ? target_obj.addDailyTask(new_task) : target_obj.addWeeklyTask(new_task);

		view.click();
	});
};
const HandleEditButtons = () => {
	const edit_btns = document.querySelectorAll('.profile i');
	const edit_obj = document.querySelector('#modal .edit-obj');

	edit_btns.forEach((edit_btn) => {
		edit_btn.addEventListener('click', () => {
			edit_obj.dataset.cardId = edit_btn.dataset.cardId;
			PopulateEditForm();
		});
	});
};
const HandleEditCheckboxes = () => {
	const edit_obj = document.querySelector('.edit-obj');
	const edit_form = edit_obj.querySelector('form');
	const edit_checkboxes = edit_form.querySelectorAll('input[type="checkbox"');

	edit_checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', () => {
			checkbox.toggleAttribute('checked');
		});
	});
};
const HandleEditSubmit = () => {
	const modal = document.querySelector('#modal');
	const edit_obj = document.querySelector('.edit-obj');
	const edit_form = edit_obj.querySelector('form');
	const edit_checkboxes = edit_form.querySelectorAll('input[type="checkbox"]');
	const apply_btn = edit_form.querySelector('#edit-apply-btn');
	const delete_btn = edit_form.querySelector('#edit-delete-btn');
	// To swap back view after editing
	const curr_view = document.querySelector('.tasks-view .active');

	apply_btn.addEventListener('click', (e) => {
		e.preventDefault();

		// Compensation for any task that gets deleted
		const removed_tasks = [];

		const card_id = edit_obj.dataset.cardId;
		const target = card_id > 0 ? account.characters[card_id - 1] : account;
		const new_name = edit_form.elements['character-name'].value;
		if (card_id > 0) target.setName(new_name);

		edit_checkboxes.forEach((checkbox) => {
			// Find which task is being modified
			const task_index = checkbox.dataset.taskIndex;
			// Daily or weekly task
			const view = checkbox.name.split('-')[0];
			// Parent div to grab other fields
			const row = checkbox.parentElement;
			const new_title = row.querySelector('input[type="text"]').value;
			const new_count = parseInt(row.querySelector('input[type="number"]').value);

			if (checkbox.hasAttribute('checked')) {
				target.tasks[view][task_index].setTitle(new_title);
				target.tasks[view][task_index].setCountTotal(new_count);
				if (target.tasks[view][task_index].getCountProgress() > new_count) {
					target.tasks[view][task_index].setCountProgress(new_count);
				}
			} else {
				removed_tasks.push([view, target, task_index]);
			}
		});

		// Deleting unchecked tasks
		let daily_ind_comp = 0;
		let weekly_ind_comp = 0;
		removed_tasks.forEach((task) => {
			if (task[0] == 'daily') {
				task[1].removeDailyTask(task[2] - daily_ind_comp);
				daily_ind_comp++;
			} else {
				task[1].removeWeeklyTask(task[2] - weekly_ind_comp);
				weekly_ind_comp++;
			}
		});

		modal.classList.remove('open');
		edit_obj.classList.add('hide');

		curr_view.click();
	});

	delete_btn.addEventListener('click', (e) => {
		e.preventDefault();

		account.removeCharacter(edit_obj.dataset.cardId - 1);

		modal.classList.remove('open');
		edit_obj.classList.add('hide');

		curr_view.click();
	});
};

const HandleInactiveTab = () => {
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			session_storage.setItem('last_active', GetNowUTCTimestamp());
		} else {
			const last_active = session_storage.getItem('last_active');
			if (last_active) {
				const now = GetNowUTCTimestamp();
				CheckForReset(now, last_active);
			}
		}
	});
};

// --- MAIN ---
// Generate new account if first visit
if (!account) {
	account = new Account();
	account.createDefaultTasks();
	UpdateLocalStorage(account);
}
// Grab data on LocalStorage
account = ParseJSON();

// Populate card carousel with account and character cards
PopulateCarousel();
// Begins countdown timers and resetting function
HandleTimer();

// Stores time of when site is not in focus and compares for reset
// Fix for tasks do not reset when site is inactive during time of reset
HandleInactiveTab();

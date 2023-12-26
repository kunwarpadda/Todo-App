document.addEventListener("keydown", function (event) {
	const new_task = document.getElementById("display_text");
	if (
		event.key !== "Enter" &&
		event.target.className !== "update_task_input"
	) {
		new_task.focus();
	}
});

function takeUpdatedInfo(taskId) {
	var updateInfoForm = document.getElementById(`update-form-${taskId}`);

	updateInfoForm.addEventListener("submit", function (event) {
		event.preventDefault();
		updateTask(taskId);
	});
}

function toggleTodo(id, checked) {
	fetch(`/checked/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ checked: checked }),
	});

	const update_button = document.getElementById(`update_button_${id}`);
	if (checked) {
		update_button.style.display = "none";
	} else {
		update_button.style.display = "inline-block";
	}
}

function enableTaskUpdate(taskId) {
	const taskText = document.getElementById(`task-text-${taskId}`);
	taskText.style.display = "none";

	const update_button = document.getElementById(`update_button_${taskId}`);
	update_button.style.display = "none";

	const updateForm = document.getElementById(`update-form-${taskId}`);
	updateForm.style.display = "inline-block";

	const updateInfoInputBox = document.getElementById(
		`update_info_input_box_${taskId}`
	);
	updateInfoInputBox.selectionStart = updateInfoInputBox.selectionEnd =
		updateInfoInputBox.value.length;
	updateInfoInputBox.focus();
}

function updateTask(taskId) {
	const updatedTask = document
		.getElementById(`update-form-${taskId}`)
		.querySelector('input[name="updated_task"]').value;

	const taskText = document.getElementById(`task-text-${taskId}`);
	taskText.innerHTML = updatedTask;

	taskText.style.display = "inline"; // Set display to 'inline'

	const update_button = document.getElementById(`update_button_${taskId}`);
	update_button.style.display = "inline-block";

	const updateForm = document.getElementById(`update-form-${taskId}`);
	updateForm.style.display = "none";

	fetch(`/update/${taskId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `task_info=${encodeURIComponent(updatedTask)}`,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => console.log(data))
		.catch((error) => console.error("Error:", error));
}

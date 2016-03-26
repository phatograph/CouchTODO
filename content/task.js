function getTasks() {
  var taskId = document.getElementById('taskId');

    var req = new XMLHttpRequest();
    req.open("GET", "/tasks/" + taskId.value);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = function() {
        var testInfo = (JSON.parse(req.responseText));
        var header = document.getElementById('header');
        header.innerHTML = testInfo.task;
    }
    req.send(null);
}

function init() {
    getTasks();
}

$(init);

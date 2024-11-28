let studentNames = ["Click", "A", "Teacher's", "Name", "Above"];
const rosterDiv = document.getElementById('roster-table');
const groupsDiv = document.getElementById('groups-table');
let studentButtonsArray = [];
const brandtClassButton = document.getElementById("brandt");
brandtClassButton.addEventListener('click',displayBrandtRoster);
const kendallClassButton = document.getElementById("kendall");
kendallClassButton.addEventListener('click',displayKendallRoster);
const shuffleGroupsButton = document.getElementById("shuffle-groups");
const shuffleStudentsButton = document.getElementById("shuffle-students");
shuffleGroupsButton.addEventListener('click',makeThisManyGroups);
shuffleStudentsButton.addEventListener('click',makeGroupsWithThisManyStudents);
const addStudentsForm = document.querySelector('.add-students');
let addStudentName = document.querySelector('.add-student-name');

//function to create the initial student table
//create table body
function makeRosterTable() {
  //clear previous student table
  rosterDiv.innerHTML = "";
  //create new table
  var rosterTable = document.createElement("table");
  var rosterTableBody = document.createElement("tbody");

  for (var i=0; i<studentNames.length; i++) {
    //create a new row every 5 names
    if (i%5===0) {
      var row = document.createElement("tr");
    }
    //create cells and fill them with buttons for each student name
    var cell = document.createElement("td");
    var studentButton = document.createElement("button");
    studentButtonsArray.push(studentButton);
    var studentName = document.createTextNode(studentNames[i]);
    studentButton.appendChild(studentName);
    cell.appendChild(studentButton);
    row.appendChild(cell);

    rosterTableBody.appendChild(row);

  }
  rosterTable.appendChild(rosterTableBody);
  rosterDiv.appendChild(rosterTable);

  //add a listener to add/remove students from the students array when clicked
  studentButtonsArray.forEach(button => button.addEventListener('click', function(){
    if (this.classList.contains('active')) {
      this.classList.remove('active');
      console.log(studentNames.indexOf(button.innerHTML));
      studentNames.push(button.innerHTML);
    } else {
      this.classList.add('active');
      console.log(studentNames.indexOf(button.innerHTML));
      studentNames.splice(studentNames.indexOf(button.innerHTML),1);
    }
  }));
}

//function to add students to the studentButtonsArray
function addStudent(e) {
  e.preventDefault();
  console.log('student added');
  console.log(addStudentName.value);
  studentNames.push(addStudentName.value);
  rosterDiv.removeChild(rosterDiv.lastChild);
  makeRosterTable();
  addStudentsForm.reset();

}


//this function called when the "groups" shuffle button pressed
function makeThisManyGroups(){
  //clear any previous table
  groupsDiv.innerHTML = "";
  //figure out the number of students per group based on the number of groups wanted
  var groups = parseInt(document.getElementById("groups").value);
  var studentsPerGroup = Math.floor(studentNames.length / groups);
  //this is the remainder -> the number of large groups needed to put all students into groups
  var remainder = (studentNames.length % groups);
  console.log("There are " + studentNames.length + " active students. You want to put them into groups of " + groups + ".");
  console.log("There will be " + studentsPerGroup + " students in each group, with " + remainder + " large group of " + (studentsPerGroup + 1) + ".");

  //shuffle students
  fisherYatesShuffle();

  //create the table to display the groups
  var groupsTable = document.createElement("table");
  var groupsTableBody = document.createElement("tbody");
  var row = document.createElement("tr");
  //counter to number each student within the group
  var memberNumber = 1;
  //create a new td (column) for each new group
  //this will count how many large groups we have made
  var largeGroupCounter = 0;
  for (var i=0; i<studentNames.length; i++) {
    //put large groups first
    if (largeGroupCounter <= remainder) {
      if (i%(studentsPerGroup+1)===0) {
      var cell = document.createElement("td");
      //console.log("Large Group Created");
      memberNumber = 1;
      largeGroupCounter++;
      }
    } else {
      //once all large groups have been created, go back to regular-sized groups
      if ((i-remainder)%(studentsPerGroup)===0) {
      var cell = document.createElement("td");
      //console.log("Regular Group Created");
      memberNumber = 1;
      }
    }

    //create paragraph elements and fill them with each student name
    var studentNameElement = document.createElement("p");
    var studentName = document.createTextNode(memberNumber + ": " + studentNames[i]);
    memberNumber++;
    studentNameElement.appendChild(studentName);
    cell.appendChild(studentNameElement);
    row.appendChild(cell);
  }
  groupsTableBody.appendChild(row);
  groupsTable.appendChild(groupsTableBody);
  groupsDiv.appendChild(groupsTable);
}

//this function called when the "shuffle students" button pressed
function makeGroupsWithThisManyStudents(){
  //clear any previous table
  groupsDiv.innerHTML = "";
  //figure out the number of students per group based on the number of groups wanted
  var studentsInEachGroup = parseInt(document.getElementById("students").value);
  var numOfGroups = Math.floor(studentNames.length / studentsInEachGroup);
  //this is the remainder -> the number of large groups needed to put all students into groups
  var remainder = (studentNames.length % studentsInEachGroup);
  console.log("There are " + studentNames.length + " active students. You want to put " + studentsInEachGroup + " students in each group.");
  console.log("There will be " + numOfGroups + " groups, with " + remainder + " students in another group.");

  //shuffle students
  fisherYatesShuffle();

  //create the table to display the groups
  var groupsTable = document.createElement("table");
  var groupsTableBody = document.createElement("tbody");
  var row = document.createElement("tr");
  //counter to number each student within the group
  var memberNumber = 1;
  //create a new td (column) for each new group
  for (var i=0; i<studentNames.length; i++) {
    if (i%studentsInEachGroup===0) {
      var cell = document.createElement("td");
      //console.log("Regular Group Created");
      memberNumber = 1;
    }

    //create paragraph elements and fill them with each student name
    var studentNameElement = document.createElement("p");
    var studentName = document.createTextNode(memberNumber + ": " + studentNames[i]);
    memberNumber++;
    studentNameElement.appendChild(studentName);
    cell.appendChild(studentNameElement);
    row.appendChild(cell);
  }
  groupsTableBody.appendChild(row);
  groupsTable.appendChild(groupsTableBody);
  groupsDiv.appendChild(groupsTable);
}

function fisherYatesShuffle(){

  var currentIndex = studentNames.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = studentNames[currentIndex];
    studentNames[currentIndex] = studentNames[randomIndex];
    studentNames[randomIndex] = temporaryValue;
  }
  console.log(studentNames);
}

function displayBrandtRoster() {
  studentNames = ["Adam", "Ava", "Charlie", "Eden", "Ekisha", "Ellie", "Everett", "Gonzo", "Harrison", "Henry", "Jack", "Jackson", "Kaila", "Karar", "Kinsley", "Landon", "Logan", "Luke", "Maddyn", "Manu", "Mia", "Mikey", "Mirthik", "Nidhi", "Redeat", "Xavier", "Yashika"];
  rosterDiv.classList.add("brandt");
  rosterDiv.classList.remove("kendall");
  brandtClassButton.classList.add("selected");
  kendallClassButton.classList.remove("selected");
  makeRosterTable();
}

function displayKendallRoster() {
  studentNames = ["Anantbir", "Avery", "Benjamin", "Caleb", "Chance", "Charline", "Chase", "Chris", "Cole", "Delaney", "Derrin", "Elena", "Emerson", "Emry", "Gavin", "Kadija", "Lana", "Mav", "Oscar", "Penelope", "Quinn", "Roheen", "RV", "Saul", "Sophia", "Susanna", "Wesley"];
  rosterDiv.classList.add("kendall");
  rosterDiv.classList.remove("brandt");
  kendallClassButton.classList.add("selected");
  brandtClassButton.classList.remove("selected");
  makeRosterTable();
}

window.onload = function(){
  makeRosterTable();
  addStudentsForm.addEventListener('submit', addStudent);
}

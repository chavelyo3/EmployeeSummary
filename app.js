const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];

function generateTeam(){

    inquirer
    .prompt([
        {
            message: "What is the name of the Team Member?",
            name: "name",
        },

        {
            type: "list",
            message: "What is the team member's role?",
            choices: ["Engineer", "Intern", "Manager"],
            name: "role",
        },

        {
            message: "what is the team member's I.D?",
            name: "id",
        },

        {
            message: "What is the team member's email address?",
            name: "email",
        },

    ])

    .then(function ({ name, role, id, email }) {
        let roleAnswer = "";
        if (role === "Engineer") {
          roleAnswer = "GitHub username";
        } else if (role === "Intern") {
          roleAnswer = "school";
        } else {
          roleAnswer = "office number";
        } 
        inquirer
        .prompt([
            {
                message: `What is this team member's ${roleAnswer}?`,
                name: "roleAnswer",
            },

            {
                type: "confirm",
                message: "Would you like to add more team member's?",
                name: "addMembers",
            },

        ])
        .then(function ({ roleAnswer, addMembers }) {
            let teamMember;
            if (role === "Engineer") {
              teamMember = new Engineer(name, id, email, roleAnswer);
            } else if (role === "Intern") {
              teamMember = new Intern(name, id, email, roleAnswer);
            } else {
              teamMember = new Manager(name, id, email, roleAnswer);
            }
            employees.push(teamMember);
            if (addMembers) {
              generateTeam();
            } else {
              render(employees);
              fs.writeFile(outputPath, render(employees), (err) => {
                if (err) {
                  throw err;
                }
                console.log("Success!");
              });
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error: ", err);
            }
          });
      });
  }
  generateTeam();
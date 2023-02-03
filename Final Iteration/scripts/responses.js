class chatBot {
    questions = [
        {
            id: 1,
            value: "Do you want to go on holiday yes or no?",
            expectedAnswers: ["yes", "no"],
            followupQuestion: 2,
            filterOn: "yes"
        },
        {
            id: 2,
            value: "Do you want some where hot, mild or cold",
            expectedAnswers: ["hot", "cold", "mild"],
            followupQuestion: 3,
            filterOn: "TempRating"
        },
        {
            id: 3,
            value: "Do you want it to be active or lazy",
            expectedAnswers: ["active", "lazy"],
            filterOn: "Category"
        }
    ];

    answers = [];

    processMessage = (input) => {
        const neededToFinish = 3;

        let finished = false
        this.questions.map((question) => {
            if (question.expectedAnswers.includes(input)) {
                //found the question
                this.answers.push({ id: question.id, answer: input });
                if (question.followupQuestion) {
                    this.askQuestion(question.followupQuestion);
                } else {
                    finished = true
                }
            }
        });

        if (this.answers.length == neededToFinish && finished) {
            let data = [
                { yes: "yes", HolidayReference: "1", HotelName: "Premium Suites", City: "Newcastle", Continent: "Europe", Country: "United Kingdom", Category: "active", StarRating: "3",TempRating: "mild",Location: "city",PricePerPerNight: "80"},
                { yes: "yes", HolidayReference: "2",HotelName: "Relaxamax",City: "New Orleans",Continent: "North America",Country: "USA",Category: "lazy",StarRating: "4",TempRating: "mild",Location: "city",PricePerPerNight: "28"},
                { yes: "yes", HolidayReference: "3",HotelName: "WindyBeach",City: "Ventry",Continent: "Europe",Country: "Ireland",Category: "active",StarRating: "3",TempRating: "mild",Location: "sea",PricePerPerNight: "42"},
                { yes: "yes", HolidayReference: "4",HotelName: "Twighlight",City: "Marrakech",Continent: "Africa",Country: "Morocco",Category: "lazy",StarRating: "5",TempRating: "cold",Location: "mountain",PricePerPerNight: "50"},
            ];
            if (window.csvData) {
                data = window.csvData;
            }

            this.answers.map((answer) => {
                const field = this.questions.find(
                    (question) => question.id == answer.id
                ).filterOn;

                data = data.filter((row) => row[field] == answer.answer);
            });

            this.postFinalMessage(data);
        }
    };

    askQuestion(id) {
        //some code to update the chat box dom to add a new message

        const question = this.questions.find((question) => question.id == id);
        let qText = renderMessageEle(question.value);
        console.log(question);
        console.log(answer);
        document.getElementById("chatbox").appendChild(qText);
    }

    postFinalMessage(data) {
        //some code to update the chat box with the final list of matches
        let headers = ["HotelName ", "City ", "Country ", "StarRating ", "PricePerPerNight "];
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            let header = document.createElement('th');
            let textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });

        table.appendChild(headerRow);

        data.forEach(hol => {
            let row = document.createElement('tr');
            delete hol.Location;
            delete hol.HolidayReference;
            delete hol.yes;
            delete hol.Continent;
            delete hol.Category;
            delete hol.TempRating;
            Object.values(hol).forEach(text => {
                let cell = document.createElement('td');
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);
                row.appendChild(cell);
            })

            table.appendChild(row);
            table.classList.add("chatbot-message");
        });
        document.getElementById("chatbox").appendChild(table);
    }
    
}
///////////////////////////////////////////////////////////////////////////////////////
//global variables
const boxBody = document.querySelector(".box-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");
let cb = new chatBot;

//user is able to use the send button or press the enter key to send message
    send.addEventListener("click", () => renderUserMessage());

    txtInput.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            renderUserMessage();
        }
    });
//rendering of different types of messages
const renderUserMessage = () => {
    const userInput = txtInput.value;
    renderMessageEle(userInput, "user");
    txtInput.value = "";
    const input = userInput.toLowerCase();
    cb.processMessage(input);
};

const renderMessageEle = (txt, type) => {
    let className = "user-message";
    if (type !== "user") {
        className = "chatbot-message";
    }
    const messageEle = document.createElement("div");
    const txtNode = document.createTextNode(txt);
    messageEle.classList.add(className);
    messageEle.append(txtNode);
    boxBody.append(messageEle);
};

window.addEventListener('DOMContentLoaded', (event, userInput) => {
    cb.askQuestion(1);
});

//dataimport
const myForm = document.getElementById("csvInput");
const csvFile = document.getElementById("csvFile");

function csvToArray(str, delimiter = ",") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return the array
    return arr;
}

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        window.csvData = data;
    };

    reader.readAsText(input);
});
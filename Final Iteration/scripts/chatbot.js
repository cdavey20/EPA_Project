//outputs/inputs
const boxBody = document.querySelector(".box-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");
//after clicking send button input is read as user message
send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        renderUserMessage();
    }
});

const renderUserMessage = () => {
    const userInput = txtInput.value;
    renderMessageEle(userInput, "user");
    txtInput.value = "";
    setTimeout(() => {
        renderChatbotResponse(userInput);
    }, 600);
};

const renderChatbotResponse = (userInput) => {
    const res = getChatbotResponse(userInput);
    renderMessageEle(res);
}

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

const getChatbotResponse = (userInput) => {
    return responseObj[userInput] == undefined ? "Please try something else, like hey or hello" : responseObj[userInput];
};

let btnGet = document.querySelector('button');
let myTable = document.querySelector('#table');


let employees = [
    { name: 'James', age: 21, country: 'United States' },
    { name: 'Rony', age: 31, country: 'United Kingdom' },
    { name: 'Peter', age: 58, country: 'Canada' },
    { name: 'Marks', age: 20, country: 'Spain' }
]

let headers = ['Name', 'Age', 'Country'];

btnGet.addEventListener('click', () => {
    let table = document.createElement('table');
    let headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    employees.forEach(emp => {
        let row = document.createElement('tr');

        Object.values(emp).forEach(text => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })

        table.appendChild(row);
    });

    myTable.appendChild(table);
});


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
        let data = [""

        ];

        this.answers.map((answer) => {
            const field = this.questions.find(
                (question) => question.id == answer.id
            ).filterOn;

            data = data.filter((row) => row[field] == answer.answer);
        });

        postFinalMessage(JSON.stringify(data));
    }
};
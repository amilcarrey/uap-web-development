type Task = {
    id: number;
    text: string;
    done: boolean;
}

function helloWorld(task: Task) {
    console.log("Hello World! ${task.text}");
}

function howLongAgo(date: Date) {

}

const task: Task = {
    id: 1,
    text: "Hello World",
    done: false
}
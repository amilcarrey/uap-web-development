const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export default function ChangeList({setTasks, setLoading, newValue}) {
    return (
        <button onClick={() => {
            setLoading(true);
            setTasks(newValue);
            sleep(2000).then(() => {
                // Simulate a network request
                console.log("Data loaded");
            });
            setLoading(false);
        }}>Change list</button>
    )
}
import { useState, useEffect } from "react";
// useState is a React hook that allows a stored state in a functional component/hook
// useEffect is a React hook that runs side effect, like fetching data or subscribing to events

export default function useComponents() {
    const [components, setComponents] = useState([]);
    // [holds an array of component objects fetched from backend, function to update the components state]
    // useState([]) has an initial value that is an empty array since no components have been fetched

    useEffect(() => {
        fetch("http://localhost:4000/components") // GET req to backend
        .then(res => res.json()) // Converts HTTP res to json object
        .then(data => setComponents(data)) // Updates state so the component now has the components array
        .catch(err => console.error("Failed to fetch components:", err));
    }, []); // [] means run this effect only once the component mounts/first appears on the page

    return components;
}
import React from 'react'
var fetch = require("cross-fetch")
class Form extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <form onSubmit = {this.handleSubmit}>
                <textarea ref = {(el) => {this.textRef = el}}></textarea>
                <input type = "submit"></input>
            </form>
        )
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.textRef.value);
        var str = this.textRef.value;
        fetch("http://localhost:8080/feedback", {
            method: "POST",
            headers: {"Content-type" : "text/plain"},
            body: str
        }).then(res => res.text()).then(res => console.log(res))
    }
}

export default Form

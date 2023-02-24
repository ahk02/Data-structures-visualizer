import React from 'react';
import arrayModifier from './arrayModifier'
import { motion } from 'framer-motion'
import './canvas.css'
var fetch = require('cross-fetch')

var coordinates = [
    { 'x': 40, 'y': 90 }, { 'x': 160, 'y': 90 },
    { 'x': 280, ' y': 90 }, { 'x': 400, 'y': 90 },
    { 'x': 520, ' y': 90 }, { 'x': 640, 'y': 90 },
    { 'x': 760, ' y': 90 }, { 'x': 880, 'y': 90 },
    { 'x': 1000, 'y': 90 }, { 'x': 1120, 'y': 90 },
    { 'x': 40, 'y': 200 }, { 'x': 160, 'y': 200 },
    { 'x': 280, ' y': 200 }, { 'x': 400, 'y': 200 },
    { 'x': 520, ' y': 200 }, { 'x': 640, 'y': 200 },
    { 'x': 760, ' y': 200 }, { 'x': 880, 'y': 200 },
    { 'x': 1000, 'y': 200 }, { 'x': 1120, 'y': 200 }
];

class Node {
    constructor(x, y, dx, dy, value, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.value = value;
        this.context = context;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = "lightgreen";
        this.context.arc(this.x, this.y, 26, Math.PI * 2, false);
        this.context.fill();
        this.context.fillStyle = "black";
        this.context.font = "15px Arial";
        this.context.fillText(String(this.value), this.x - 5, this.y + 2);
    }
}

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            sample_insert: false,
            latestDeleted: 0,
            insert: false,
            delete: false,
            count: 0,
            elements: []
        };
    }


    render() {
        return (
            <div className="field">
                <motion.canvas initial={{ x: -500 }} animate={{ x: 0 }} ref={this.canvasRef} {...this.props} className="canvas" /><br />
                <div className="nonCanvas">
                    <div className="commands">

                        Element:<input type="text" ref={(el) => { this.elementRef = el }} placeholder="value of node..."></input>
                        <br />
                        Position:<input type="text" ref={(el) => { this.posRef = el }} placeholder="valid position..."></input><br />


                        <button onClick={this.insert}>Insert Data at Position</button>
                        <button onClick={this.delete}>Delete From Position</button><br />

                        <button onClick={this.loadSampleData}>Load Sample Data</button>

                    </div>
                    <motion.div initial={{ x: 500 }} animate={{ x: 0 }} className="message" >
                        <p style={{ fontSize: '20px', fontWeight: '500' }}>Message:</p>
                        <p ref={(el) => { this.messageRef = el }}></p>
                    </motion.div>

                </div>
            </div>
        );
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.width = 1200;
        context.canvas.height = 500;
    }

    componentDidUpdate() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        console.log("Component Did Update")
        if (this.state.sample_insert == true) {
            console.log("Displaying sample data");
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            for (var k = 0; k < this.state.count; k++) {
                console.log("Inside for loop");
                var temp = new Node(coordinates[k].x, coordinates[k].y, 0, 0, this.state.elements[k], context);
                temp.draw();
                if (k != this.state.count - 1) {
                    if (k != 9) {
                        context.beginPath();
                        context.moveTo(coordinates[k].x + 25, coordinates[k].y);
                        context.lineTo(coordinates[k].x + 25 + 70, coordinates[k].y);
                        context.stroke();
                    }
                    else {
                        context.beginPath();
                        context.moveTo(1120 + 25, 90);
                        context.lineTo(1120 + 25, 150);
                        context.lineTo(40 - 25, 150);
                        context.lineTo(40 - 25, 200);
                        context.stroke();
                    }
                }
            }
            this.setState({
                sample_insert: false
            })
            return;
        }
        if (this.state.insert == true) {
            var i = this.posRef.value - 1;
            var angle = Math.atan(coordinates[i].y / coordinates[i].x);
            var c = new Node(0, 0, Math.cos(angle) * 4, Math.sin(angle) * 4, this.state.elements[i], context);

            var temp_elements = this.state.elements;
            var temp_count = this.state.count;

            var old_elements = JSON.parse(JSON.stringify(temp_elements));
            old_elements.splice(i, 1);

            function animate1() {
                console.log("Inside animate")
                var f = requestAnimationFrame(animate1);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);

                for (var j = 0; j < temp_count - 1; j++) {
                    var temp = new Node(coordinates[j].x, coordinates[j].y, 0, 0, old_elements[j], context);
                    temp.draw();

                    if (j != temp_count - 2) {
                        if (j != 9) {
                            context.beginPath();
                            context.moveTo(coordinates[j].x + 25, coordinates[j].y);
                            context.lineTo(coordinates[j].x + 25 + 70, coordinates[j].y);
                            context.stroke();
                        }
                        else {
                            context.beginPath();
                            context.moveTo(1120 + 25, 90);
                            context.lineTo(1120 + 25, 150);
                            context.lineTo(40 - 25, 150);
                            context.lineTo(40 - 25, 200);
                            context.stroke();
                        }
                    }
                }
                c.draw();
                c.x += c.dx;
                c.y += c.dy;

                if (c.x >= coordinates[i].x) {
                    cancelAnimationFrame(f);
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    console.log("Temp count = " + temp_count);

                    for (var k = 0; k < temp_count; k++) {
                        console.log("Inside for loop");
                        var temp = new Node(coordinates[k].x, coordinates[k].y, 0, 0, temp_elements[k], context);
                        temp.draw();

                        if (k != temp_count - 1) {
                            if (k != 9) {
                                context.beginPath();
                                context.moveTo(coordinates[k].x + 25, coordinates[k].y);
                                context.lineTo(coordinates[k].x + 25 + 70, coordinates[k].y);
                                context.stroke();
                            }
                            else {
                                context.beginPath();
                                context.moveTo(1120 + 25, 90);
                                context.lineTo(1120 + 25, 150);
                                context.lineTo(40 - 25, 150);
                                context.lineTo(40 - 25, 200);
                                context.stroke();
                            }
                        }
                    }
                }
            }
            animate1();
            this.setState({
                insert: false,
                delete: false
            })
        }
        else if (this.state.delete == true) {
            var i = this.posRef.value - 1;
            var temp_count = this.state.count;
            var angle = Math.atan(400 / 1100);
            var temp_elements = this.state.elements;
            var deleted_node = new Node(coordinates[i].x, coordinates[i].y, Math.cos(angle) * 6, Math.sin(angle) * 6, this.state.latestDeleted, context);
            function animate2() {
                var f = requestAnimationFrame(animate2);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                for (var j = 0; j < temp_count; j++) {
                    var temp = new Node(coordinates[j].x, coordinates[j].y, 0, 0, temp_elements[j], context);
                    temp.draw();
                    if (j != temp_count - 1) {
                        if (j != 9) {
                            context.beginPath();
                            context.moveTo(coordinates[j].x + 25, coordinates[j].y);
                            context.lineTo(coordinates[j].x + 25 + 70, coordinates[j].y);
                            context.stroke();
                        }
                        else {
                            context.beginPath();
                            context.moveTo(1120 + 25, 90);
                            context.lineTo(1120 + 25, 150);
                            context.lineTo(40 - 25, 150);
                            context.lineTo(40 - 25, 200);
                            context.stroke();
                        }
                    }
                }
                deleted_node.draw();
                deleted_node.x += deleted_node.dx;
                deleted_node.y += deleted_node.dy;
                if (deleted_node.x >= 1100) {
                    cancelAnimationFrame(f);
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    for (var j = 0; j < temp_count; j++) {
                        var temp = new Node(coordinates[j].x, coordinates[j].y, 0, 0, temp_elements[j], context);
                        temp.draw();
                        if (j != temp_count - 1) {
                            if (j != 9) {
                                context.beginPath();
                                context.moveTo(coordinates[j].x + 25, coordinates[j].y);
                                context.lineTo(coordinates[j].x + 25 + 70, coordinates[j].y);
                                context.stroke();
                            }
                            else {
                                context.beginPath();
                                context.moveTo(1120 + 25, 90);
                                context.lineTo(1120 + 25, 150);
                                context.lineTo(40 - 25, 150);
                                context.lineTo(40 - 25, 200);
                                context.stroke();
                            }
                        }
                    }
                }
            }
            animate2();
            this.setState({
                insert: false,
                delete: false
            })
        }
    }

    insert = () => {
        if (this.state.count + 1 > 20) {
            this.messageRef.innerHTML = "Too many elements";
            return;
        }
        if (this.elementRef.value == '') {
            this.messageRef.innerHTML = "Please Enter a Value";
            return;
        }
        if (this.posRef.value > this.state.count + 1 || this.posRef.value < 1) {
            this.messageRef.innerHTML = "Invalid Position";
            return;
        }
        this.messageRef.innerHTML = "";
        var temp = this.state.elements;
        var newarray = arrayModifier(temp, this.elementRef.value, this.posRef.value, true);
        console.log(newarray);
        this.setState({
            delete: false,
            insert: true,
            count: this.state.count + 1,
            elements: newarray
        })
        console.log(this.state.elements);
    }

    delete = () => {
        if (this.posRef.value == '') {
            this.messageRef.innerHTML = "Please Enter a Position";
            return;
        }
        if (this.posRef.value > this.state.count || this.posRef.value < 1) {
            this.messageRef.innerHTML = "Invalid Position";
            return;
        }
        this.messageRef.innerHTML = "";
        var temp = this.state.elements;
        var temp1 = JSON.parse(JSON.stringify(temp));
        var deleted_element = temp1.splice(this.posRef.value - 1, 1);
        var newarray = arrayModifier(temp, this.elementRef.value, this.posRef.value, false);
        console.log(newarray);
        this.setState({
            latestDeleted: deleted_element,
            insert: false,
            delete: true,
            count: this.state.count - 1,
            elements: newarray
        })
        console.log(this.state.elements);
    }
    loadSampleData = () => {
        var sample_data = [];
        var final_array = []
        fetch("/sample")
            .then(response => response.text())
            .then(response => {
                console.log(response)
                sample_data.push(JSON.parse(response));
                sample_data = sample_data[0][0].sample_arrays;
                console.log(sample_data);
                final_array = sample_data[Math.floor(Math.random() * 3)];
                console.log(final_array);
                this.setState({
                    sample_insert: true,
                    elements: final_array,
                    count: final_array.length
                })
            })
    }
}

export default Canvas
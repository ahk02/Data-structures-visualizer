import React from 'react';
import './ll.css'
import arrayModifier from './arrayModifier'
import { motion } from "framer-motion"
const coordinates = [{ 'x': 40, 'y': 90 }, { 'x': 160, 'y': 90 }, { 'x': 280, 'y': 90 }, { 'x': 400, 'y': 90 },
{ 'x': 520, 'y': 90 }, { 'x': 640, 'y': 90 }, { 'x': 760, 'y': 90 }, { 'x': 880, 'y': 90 }, { 'x': 1000, 'y': 90 },
{ 'x': 1120, 'y': 90 }, { 'x': 4, 'y': 100 }];

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
        this.context.arc(this.x, this.y, 26, Math.PI * 2, false);
        this.context.stroke();
        this.context.font = "15px Arial";
        this.context.fillText(String(this.value), this.x - 5, this.y + 2);
    }
}

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            latestDeleted: 0,
            insert: true,
            count: 0,
            elements: []
        };
    }

    render() {
        return (
            <>
                <motion.div initial={{}} animate={{}} className="commands">
                    <motion.div initial={{x:-500}} animate={{x:0}}>
                    {/* <motion.p animate={{  }}>Enter the Element:</motion.p> */}
                    <div style={{display:'flex', justifyContent:'space-evenly'}}>
                    <input type="text" ref={(el) => { this.elementRef = el }} placeholder="Element"></input>
                    <input type="text" ref={(el) => { this.posRef = el }} /*defaultValue="1"*/ placeholder="Position"></input>
                    </div>
                    <button onClick={this.insert}>Insert Data at Position</button>
                    <button onClick={this.delete}>Delete From Position</button>
                    <p ref={(el) => { this.messageRef = el }}></p>
                    </motion.div>
                    <motion.canvas initial ={{x:500}} animate={{x:0 }} ref={this.canvasRef} {...this.props} className="canvas" /><br />
                </motion.div>
            </>
        );
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.width = 1000;
        context.canvas.height = 700;
    }

    componentDidUpdate() {
        console.log("Component did update")
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        if (this.state.insert == true) {
            var i = this.posRef.value - 1;
            var angle = Math.atan(coordinates[i].y / coordinates[i].x);
            var c = new Node(0, 0, Math.cos(angle) * 2, Math.sin(angle) * 2, this.state.elements[i], context);

            var temp_elements = this.state.elements;
            var temp_count = this.state.count;

            var old_elements = JSON.parse(JSON.stringify(temp_elements));
            old_elements.splice(i, 1);

            function animate() {
                var f = requestAnimationFrame(animate);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);

                for (var j = 0; j < temp_count - 1; j++) {
                    var temp = new Node(coordinates[j].x, coordinates[j].y, 0, 0, old_elements[j], context);
                    temp.draw();

                    if (j != temp_count - 2) {
                        if (temp_count - 1 != 10) {
                            context.beginPath();
                            context.moveTo(coordinates[j].x + 25, coordinates[j].y);
                            context.lineTo(coordinates[j].x + 25 + 70, coordinates[j].y);
                            context.stroke();
                        }
                        else {
                            // context.beginPath();
                            // context.moveTo(coordinates[j].x + 25, coordinates[j].y);
                            // context.lineTo(coordinates[j].x + 25 + 5, coordinates[j].y + 50);
                            // context.lineTo(20, coordinates[j].y + 50);
                            // context.lineTo(20, coordinates[j + 1].y);
                            // context.lineTo(40, coordinates[j + 1].y);
                            // context.stroke();
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
                        console.log("Inside for loop")
                        var temp = new Node(coordinates[k].x, coordinates[k].y, 0, 0, temp_elements[k], context);
                        temp.draw();

                        if (k != temp_count - 1) {
                            if (temp_count - 1 != 10) {
                                context.beginPath();
                                context.moveTo(coordinates[k].x + 25, coordinates[k].y);
                                context.lineTo(coordinates[k].x + 25 + 70, coordinates[k].y);
                                context.stroke();
                            }
                            else {
                                // context.beginPath();
                                // context.moveTo(coordinates[j].x + 25, coordinates[j - 1].y);
                                // context.lineTo(coordinates[j].x + 25 + 5, coordinates[j - 1].y + 50);
                                // context.lineTo(20, coordinates[j - 1].y + 50);
                                // context.lineTo(20, coordinates[j].y);
                                // context.lineTo(40, coordinates[j].y);
                                // context.stroke();
                            }
                        }
                    }
                }
            }
            animate();
        }
        else {
            var i = this.posRef.value - 1;
            var old_elements = JSON.parse(JSON.stringify(temp_elements));
            old_elements.splice(i, 1);
            function animate() {
                var f = requestAnimationFrame(animate);
                var temp = new Node(coordinates[i].x, coordinates[i].y, 1100, 400, 1, context);
            }
        }
    }

    insert = () => {
        if (this.elementRef.value == '') {
            this.messageRef.innerHTML = "Please Enter a Value";
            return;
        }
        if (this.posRef.value > this.state.count + 1 || this.posRef.value < 1) {
            this.messageRef.innerHTML = "Invalid Position";
            return;
        }
        var temp = this.state.elements;
        var newarray = arrayModifier(temp, this.elementRef.value, this.posRef.value, true);
        console.log(newarray);
        this.setState({
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
        if (this.posRef.value > this.state.count + 1 || this.posRef.value < 1) {
            this.messageRef.innerHTML = "Invalid Position";
            return;
        }
        var temp = this.state.elements;
        var temp1 = JSON.parse(JSON.stringify(temp));
        var deleted_element = temp1.splice(this.posRef.value - 1, 1);
        var newarray = arrayModifier(temp, this.elementRef.value, this.posRef.value, false);
        console.log(newarray);
        this.setState({
            latestDeleted: deleted_element,
            insert: false,
            count: this.state.count - 1,
            elements: newarray
        })
        console.log(this.state.elements);
    }
}

export default Canvas
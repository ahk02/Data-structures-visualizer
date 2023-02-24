import React from 'react'
import {motion} from 'framer-motion'
var fetch = require('cross-fetch')

class element {
    constructor(currX, currY, posX, posY, color, value, dx, dy, c) {
        this.currX = currX
        this.currY = currY
        this.posX = posX
        this.posY = posY
        this.color = color
        this.value = value
        this.dx = dx
        this.dy = dy
        this.c = c
    }
    draw() {
        this.c.beginPath()
        this.c.fillStyle = this.color
        this.c.fillRect(this.currX, this.currY, 100, 50)
        this.c.fill()
        this.c.fillStyle = 'black'
        this.c.fillText(this.value, this.currX + 50, this.currY + 25)
    }
}
class stack {
    constructor(size, c) {
        this.size = size
        this.c = c
        this.x = this.c.canvas.width / 2 - 50
        if (this.size <= 7)
            this.y = this.c.canvas.height / 2 - 100
        else
            this.y = this.c.canvas.height / 4 - 100
        this.topx = this.x
        this.topy = this.y + (this.size - 1) * 50
        this.top_stack_x = this.x
        this.top_stack_y = this.y
    }
    draw() {
        this.c.beginPath()
        var i = 0
        this.y = this.top_stack_y
        this.c.lineWidth = '5px'
        this.c.strokeStyle = 'white'
        while (i < this.size) {
            this.c.strokeRect(this.x, this.y, 100, 50)
            this.y += 50
            i++
        }
        // this.c.strokeStyle = 'white'
        // this.c.stroke()
    }
}

class Canvas2 extends React.Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
        this.insertRef = React.createRef()
        this.deleteRef = React.createRef()
        this.state = {
            stack_size: 0,
            set: 0,
            insert_val: null,
            pop_val: null,
            blocks: [],
            process: false,
            stack: null
        }
    }
    componentDidMount() {
        const canvas = this.canvasRef.current
        const c = canvas.getContext('2d')
        c.canvas.width = 1200
        c.canvas.height = 600
        c.fillStyle = 'black'
        c.fillRect(0, 0, c.canvas.width, c.canvas.height)
    }
    componentDidUpdate() {
        const canvas = this.canvasRef.current
        const c = canvas.getContext('2d')
        var p = this.state.stack
        var blocks = this.state.blocks
        var set_stack_size = (stack_size) => {
            var p = new stack(stack_size, c)
            p.draw()
            this.state.stack = p
            if (this.state.set == 0)
                this.state.set = 1
            this.state.process = false
        }

        var reach = (block) => {
            var t1 = requestAnimationFrame(() => { reach(block) })
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            p.draw()
            blocks.forEach((block_) => {
                block_.draw()
            })
            var angle = Math.atan2((p.top_stack_y - block.currY), (p.top_stack_x - block.currX))
            //console.log(angle)
            block.dx = 10 * Math.cos(angle)
            block.dy = 10 * Math.sin(angle)
            if (block.currY >= p.top_stack_y) {
                block.dy = 5
                block.dx = 0
            }
            block.currX += block.dx
            block.currY += block.dy
            if (block.currX >= block.posX) {
                block.currX = block.posX
            }
            if (block.currY >= block.posY) {
                block.currX = block.posX
                block.currY = block.posY
                console.log(block.currY)
                c.fillStyle = 'black'
                c.fillRect(0, 0, canvas.width, canvas.height)
                p.draw()
                if (blocks.length != 0)
                    blocks.forEach((block) => {
                        block.draw()
                    })
                update(blocks)
                deprocess()
                cancelAnimationFrame(t1)
            }
            else {
                block.draw()
            }
        }

        var remove = () => {
            var t1 = requestAnimationFrame(remove)
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            p.draw()
            if (blocks.length != 0) {
                blocks.forEach((block) => {
                    block.draw()
                })
                blocks[blocks.length - 1].posX = p.top_stack_x - 100
                blocks[blocks.length - 1].posY = p.top_stack_y - 100
                if (blocks[blocks.length - 1].currY >= p.top_stack_y) {
                    blocks[blocks.length - 1].dy = -5
                    blocks[blocks.length - 1].currY += blocks[blocks.length - 1].dy
                }
                else {
                    var angle = Math.atan2((blocks[blocks.length - 1].posY - blocks[blocks.length - 1].currY), (blocks[blocks.length - 1].posX - blocks[blocks.length - 1].currX))
                    blocks[blocks.length - 1].dx = 10 * Math.cos(angle)
                    blocks[blocks.length - 1].dy = 10 * Math.sin(angle)
                    blocks[blocks.length - 1].currX += blocks[blocks.length - 1].dx
                    blocks[blocks.length - 1].currY += blocks[blocks.length - 1].dy
                }
                if (blocks[blocks.length - 1].currX <= blocks[blocks.length - 1].posX && blocks[blocks.length - 1].currY <= blocks[blocks.length - 1].posY) {
                    blocks.splice(blocks.length - 1, 1)
                    p.topy += 50
                    c.fillStyle = 'black'
                    c.fillRect(0, 0, canvas.width, canvas.height)
                    p.draw()
                    blocks.forEach((block_) => {
                        block_.draw()
                    })
                    cancelAnimationFrame(t1)
                    update(blocks)
                    deprocess()
                }
                /*else
                {
                    blocks[blocks.length-1].draw()
                }*/
            }
        }

        function push(value) {
            if (p.topy < p.top_stack_y) {
                deprocess()
                alert("Stack Overflow...")
                return
            }
            var block = new element(10, 10, p.topx, p.topy, `hsl(${Math.random() * 360},100%,50%)`, value, 1, 1, c)
            p.topy -= 50
            blocks.push(block)
            reach(block)
            //move_down(block)
        }

        function pop() {
            console.log(p.topy, p.top_stack_y)
            if (p.topy >= p.top_stack_y + (p.size - 1) * 50) {
                alert("Stack Underflow...")
                deprocess()
                return
            }
            remove()
        }
        var update = (blocks) => {
            this.state.blocks = blocks
        }
        var deprocess = () => {
            this.state.process = false
        }
        if (this.state.set == 0 && this.state.stack_size != 0)
            set_stack_size(this.state.stack_size)
        else if (this.state.set == 0 && this.state.stack_size == 0) {
            deprocess()
            alert("Set stack size first")
            return
        }
        else {
            if (this.state.insert_val != null)
                push(this.state.insert_val)
            if (this.state.pop_val != null)
                pop(this.state.pop_val)
        }
    }
    insert = () => {
        if (this.state.process == false) {
            var value = Number(this.deleteRef.current.value)
            this.setState({
                insert_val: value,
                pop_val: null,
                process: true
            })
        }
    }
    delete_ = () => {
        if (this.state.process == false) {
            this.setState({
                insert_val: null,
                pop_val: true,
                process: true
            })
        }
    }
    setSize = () => {
        if (this.state.process == false && this.state.set == 0) {
            var size = Number(this.insertRef.current.value)
            if (size > 10) {
                alert('Stack Size cannot be greater than 10')
                return
            }
            this.setState({
                set: 0,
                stack_size: size,
                insert_val: null,
                pop_val: null,
                process: true
            })
        }
    }
    render() {
        var mystyle = {
            border: "1px solid black"
        }
        return (
            <div className="field">
                <motion.canvas initial={{x:-500}} animate={{x:0}} ref={this.canvasRef} {...this.props} className="canvas" /><br />
                <div className="nonCanvas">
                <div className="commands">
                    Enter the size of stack:<input type="text" ref={this.insertRef}></input>
                    <button onClick={this.setSize}>Set</button>
                    <br />
                    Enter the value:<input type="text" ref={this.deleteRef}></input>
                    <button onClick={this.insert}>Push</button>&nbsp;
                    <button onClick={this.delete_}>Pop</button>
                </div>
                </div>
                <motion.p initial={{x:500}} animate={{x:0}}ref={(el) => { this.messageRef = el }}></motion.p>
            </div>
            
        )
    }
}

export default Canvas2
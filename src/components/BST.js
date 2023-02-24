import React from "react";
import {motion} from 'framer-motion';
var fetch = require('cross-fetch')

class node {
    constructor(currX, currY, posX, posY, color, left, right, value, dx, dy, c) {
        this.currX = currX
        this.currY = currY
        this.posX = posX
        this.posY = posY
        this.color = color
        this.left = left
        this.right = right
        this.value = value
        this.dx = dx
        this.dy = dy
        this.c = c
    }
    draw() {
        if (this.left != null) {
            this.c.beginPath()
            this.c.moveTo(this.currX, this.currY)
            this.c.lineTo(this.left.currX, this.left.currY)
            this.c.strokeStyle = this.left.color
            this.c.stroke()
        }
        if (this.right != null) {
            this.c.beginPath()
            this.c.moveTo(this.currX, this.currY)
            this.c.lineTo(this.right.currX, this.right.currY)
            this.c.strokeStyle = this.right.color
            this.c.stroke()
        }
        if (this.value != null) {
            this.c.beginPath()
            this.c.fillStyle = this.color
            this.c.arc(this.currX, this.currY, 25, 0, Math.PI * 2)
            this.c.fill()
            this.c.fillStyle = 'black'
            this.c.fillText(this.value, this.currX, this.currY + 5)
        }
    }
}

class Canvas1 extends React.Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
        this.insertRef = React.createRef()
        this.deleteRef = React.createRef()
        this.insert = this.insert.bind(this)
        this.delete_ = this.delete_.bind(this)
        this.load_sample_set = this.load_sample_set.bind(this)
        this.state = {
            insert_val: null,
            delete_val: null,
            nodes: [],
            root: null,
            process: false
        }
    }

    componentDidMount() {
        const canvas = this.canvasRef.current
        const c = canvas.getContext('2d')
        c.canvas.width = 1200
        c.canvas.height = 500
        c.fillStyle = 'black'
        c.fillRect(0, 0, c.canvas.width, c.canvas.height)
    }

    componentDidUpdate() {
        const canvas = this.canvasRef.current
        const c = canvas.getContext('2d')
        var nodes = this.state.nodes
        var root = this.state.root
        console.log("state", this.state.root)
        if (root == null || root.value == null) {
            root = new node(canvas.width / 2, 25, canvas.width / 2, 25, `hsl(${Math.random() * 360},100%,50%)`, null, null, null, 1, 1, c)
            this.state.process = false
        }
        var insert_left = (q, temp, nodes) => {
            var t1 = requestAnimationFrame(() => { insert_left(q, temp, nodes) })
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            nodes.forEach((node) => { node.draw() })
            var angle = Math.atan2((q.left.posY - q.left.currY), (q.left.posX - q.left.currX))
            temp.dx = 10 * Math.cos(angle)
            temp.dy = 10 * Math.sin(angle)
            temp.currX += temp.dx
            temp.currY += temp.dy
            if (temp.dx > 0 && temp.dy > 0) {
                console.log('left1')
                if (temp.currX >= temp.posX && temp.currY >= temp.posY || temp.currX <= temp.posX && temp.currY >= temp.posY) {
                    temp.currX = temp.posX
                    temp.currY = temp.posY
                    c.fillStyle = 'black'
                    c.fillRect(0, 0, canvas.width, canvas.height)
                    nodes.forEach((node) => { node.draw() })
                    this.state.process = false
                    cancelAnimationFrame(t1)
                }
                else {
                    temp.draw()
                }
            }
            else {
                console.log('left')
                if ((temp.currX >= temp.posX && temp.currY <= temp.posY) || (temp.currX >= temp.posX && temp.currY <= temp.posY)) {
                    console.log('left2', temp.currX, temp.posX, temp.currY, temp.posY)
                    temp.currX = temp.posX
                    temp.currY = temp.posY
                    c.fillStyle = 'black'
                    c.fillRect(0, 0, canvas.width, canvas.height)
                    nodes.forEach((node) => { node.draw() })
                    cancelAnimationFrame(t1)
                }
                else {
                    temp.draw()
                }
            }
        }

        var insert_right = (q, temp, nodes) => {
            var t1 = requestAnimationFrame(() => { insert_right(q, temp, nodes) })
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            nodes.forEach((node) => { node.draw() })
            //var direct_dist = Math.sqrt(Math.pow((q.right.currX-q.right.posX),2)+Math.pow((q.right.currY-q.right.posY),2))
            var angle = Math.atan2((q.right.posY - q.right.currY), (q.right.posX - q.right.currX))
            temp.dx = 10 * Math.cos(angle)
            temp.dy = 10 * Math.sin(angle)
            temp.currX += temp.dx
            temp.currY += temp.dy
            if (temp.dx > 0 && temp.dy > 0) {
                console.log('right')
                if (temp.currX >= temp.posX && temp.currY >= temp.posY) {
                    temp.currX = temp.posX
                    temp.currY = temp.posY
                    c.fillStyle = 'black'
                    c.fillRect(0, 0, canvas.width, canvas.height)
                    nodes.forEach((node) => { node.draw() })
                    this.state.process = false
                    cancelAnimationFrame(t1)
                }
                else {
                    temp.draw()
                }
            }
            else {
                if (temp.currX <= temp.posX && temp.currY <= temp.posY || temp.currX >= temp.posX && temp.posY <= temp.posY) {
                    console.log('right2', temp.currX, temp.posX, temp.currY, temp.posY)
                    temp.currX = temp.posX
                    temp.currY = temp.posY
                    c.fillStyle = 'black'
                    c.fillRect(0, 0, canvas.width, canvas.height)
                    nodes.forEach((node) => { node.draw() })
                    cancelAnimationFrame(t1)
                }
                else {
                    temp.draw()
                }
            }
        }

        function glow(p, cont, text) {
            p.color = 'white'
            var font = c.font
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            nodes.forEach((node) => { node.draw() })
            c.fillStyle = 'white'
            c.font = '15px Arial'
            c.fillText(text, 75, 450)
            c.font = font
            setTimeout(() => {
                cont()
            }, 1000)
        }

        function insert(value) {
            var i = 1
            //var value = Number(document.querySelector("#insert").value)
            //var traverse = []
            var temp = new node(25, 50, null, null, `hsl(${Math.random() * 360},100%,50%)`, null, null, value, 1, 1, c)
            var p = root, q = null
            if (p.value == null) {
                root = temp;
                root.posX = canvas.width / 2
                root.posY = 50
                root.currX = root.posX
                root.currY = root.posY
                nodes.push(root)
                root.draw()
                update(root, nodes)
                return
            }
            gen(p)
            function gen(p) {
                if (p == null) {
                    evaluate()
                    return
                }
                var orig = p.color
                glow(p, cont, "Searching for the right location")
                function cont() {
                    q = p
                    if (p.value < value) {
                        p = p.right
                    }
                    else {
                        p = p.left
                    }
                    i++
                    q.color = orig
                    q.draw()
                    gen(p)
                }
            }
            function evaluate() {
                if (q.value >= temp.value) {
                    temp.posX = q.posX - canvas.width / Math.pow(2, i)
                    temp.posY = q.posY + 75
                    if (temp.posY > 350) {
                        c.fillStyle = 'black'
                        c.fillRect(0, 0, canvas.width, canvas.height)
                        nodes.forEach((node) => { node.draw() })
                        alert("Maximum height of tree attained")
                        deprocess()
                        return
                    }
                    q.left = temp
                    insert_left(q, temp, nodes)
                    nodes.push(temp)
                }
                else {
                    temp.posX = q.posX + canvas.width / Math.pow(2, i)
                    temp.posY = q.posY + 75
                    if (temp.posY > 350) {
                        c.fillStyle = 'black'
                        c.fillRect(0, 0, canvas.width, canvas.height)
                        nodes.forEach((node) => { node.draw() })
                        alert("Maximum height of tree attained")
                        deprocess()
                        return
                    }
                    q.right = temp
                    insert_right(q, temp, nodes)
                    nodes.push(temp)
                }
            }
            update(root, nodes)
        }

        function chopper(churn, child) {
            if (child != null) {
                churn.push(child)
                chopper(churn, child.left)
                chopper(churn, child.right)
            }
        }

        function fast_insert(churn, r, i) {
            var p = r, q = null, j = i
            churn.forEach((element) => {
                console.log(element)
                p = r; q = null; j = i;
                console.log(element, p)
                while (p != null) {
                    q = p
                    if (p.value >= element.value)
                        p = p.left
                    else
                        p = p.right
                    j++
                }
                //40 56  
                console.log(element.value, q.value)
                console.log('j', j)
                if (q.value >= element.value) {
                    //element.currX = element.posX = q.posX - canvas.width / Math.pow(2, j)
                    //element.currY = element.posY = q.posY + 75
                    element.posX = q.posX - canvas.width / Math.pow(2, j)
                    element.posY = q.posY + 75
                    q.left = element
                    element.left = element.right = null
                    insert_left(q, element, nodes)
                }
                else {
                    element.posX = q.posX + canvas.width / Math.pow(2, j)
                    element.posY = q.posY + 75
                    q.right = element
                    element.left = element.right = null
                    console.log('n', canvas.width / Math.pow(2, j))
                    insert_right(q, element, nodes)
                }
            })
            deprocess()
        }

        var inorder_deletion = (p, r, replica, next) => {
            var t1 = requestAnimationFrame(() => { inorder_deletion(p, r, replica, next) })
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            nodes.forEach((node) => {
                node.draw()
            })
            //drawTree(root)
            var angle = Math.atan2((replica.posY - replica.currY), (replica.posX - replica.currX))
            replica.dx = Math.cos(angle) * 5
            replica.dy = Math.sin(angle) * 5
            replica.currX += replica.dx
            replica.currY += replica.dy
            if (replica.currY <= replica.posY && replica.currX <= replica.posX) {
                replica.currX = replica.posX
                replica.currY = replica.posY
                replica.draw()
                this.state.process = false
                cancelAnimationFrame(t1)
                next()
            }
            else
                replica.draw()
        }

        function delete_(value) {
            //var value = Number(document.querySelector("#delete").value)
            var p = root
            var q = null
            var to_be_deleted = null
            if (p.value == null) {
                alert("Empty Tree...")
                deprocess()
            }
            else {
                var i = 1
                gen(p)
                function gen(p) {
                    if (p == null) {
                        evaluate(p)
                        update(root, nodes)
                        deprocess()
                        return
                    }
                    var orig = p.color
                    glow(p, cont, "Looking for " + value)
                    function cont() {
                        if (p.value == value) {
                            p.color = orig
                            p.draw()
                            evaluate(p)
                            //c.font = font
                            update(root, nodes)
                            return
                        }
                        q = p
                        if (p.value < value) {
                            p = p.right
                        }
                        else {
                            p = p.left
                        }
                        i++
                        q.color = orig
                        q.draw()
                        gen(p)
                    }
                }
                function evaluate(p) {
                    var r = p, t = null
                    if (p != null) {
                        if (p.left != null && p.right != null) {
                            p = p.right
                            while (p.left != null) {
                                t = p
                                p = p.left
                                i++
                            }
                            var replica = new node(p.posX, p.posY, r.posX, r.posY, p.color, null, null, p.value, 1, 1, c)

                            inorder_deletion(p, r, replica, next)
                            function next() {
                                if (t == null)
                                    r.right = p.right
                                else
                                    t.left = p.right
                                nodes.forEach((node) => {
                                    if (node.value == r.value) {
                                        node.value = p.value
                                        node.color = p.color
                                    }
                                })
                                if (t == null || t.left != null) {
                                    var parent = t
                                    if (t == null) {
                                        r.right = null
                                        parent = r
                                    }
                                    else
                                        t.left = null
                                    var churn = []
                                    chopper(churn, p.right)
                                    fast_insert(churn, parent, i)
                                }
                                console.log(nodes)
                                p.value = null
                                cont()
                            }
                        }
                        else if (p.left == null && p.right != null || p.left != null && p.right == null) {
                            if (q == null) {
                                deprocess()
                                var child
                                if (p.left == null) {
                                    p.right.posX = p.posX
                                    p.right.posY = p.posY
                                    p.right.currX = p.posX
                                    p.right.currY = p.posY
                                    root = p.right
                                }
                                if (p.right == null) {
                                    p.left.posX = p.posX
                                    p.left.posY = p.posY
                                    p.left.currX = p.posX
                                    p.left.currY = p.posY
                                    root = p.left
                                }
                                var churn = []
                                chopper(churn, root.left)
                                chopper(churn, root.right)
                                console.log(churn)
                                root.left = root.right = null
                                if (i == 1) i += 1
                                fast_insert(churn, root, i - 1)
                            }
                            else {
                                var child
                                if (q.left == p) {
                                    q.left = null
                                    if (p.right == null)
                                        child = p.left
                                    else
                                        child = p.right
                                }
                                else {
                                    q.right = null
                                    if (p.right == null)
                                        child = p.left
                                    else
                                        child = p.right
                                }
                                var churn = []
                                chopper(churn, child)
                                console.log(i)
                                fast_insert(churn, q, i - 1)
                            }
                            p.value = null
                            cont()
                        }
                        else {
                            if (q == null)
                            {
                                root.value = null
                            }
                            else {
                                if (q.left == p)
                                    q.left = null
                                else
                                    q.right = null
                            }
                            deprocess()
                            p.value = null
                            cont()
                        }
                        // p.value = null
                        // value = p.value
                    }
                    else
                        cont()
                    function cont() {
                        nodes.forEach((node, index) => {
                            if (node.value == null) {
                                console.log('splice', nodes)
                                to_be_deleted = node
                                nodes.splice(index, 1)
                                console.log(nodes)
                            }
                        })
                        if (to_be_deleted == null) {
                            alert("Node not found...")
                        }
                        c.fillStyle = 'black'
                        c.fillRect(0, 0, canvas.width, canvas.height)
                        nodes.forEach((node) => {
                            node.draw()
                        })
                    }
                }
            }
        }
        var update = (root, nodes) => {
            this.setState({
                insert_val: null,
                delete_val: null,
                root: root,
                nodes: nodes
            })
            console.log('root', root.value)
        }
        var deprocess = () => {
            this.state.process = false
        }
        if (this.state.insert_val != null)
            insert(this.state.insert_val)
        if (this.state.delete_val != null)
            delete_(this.state.delete_val)

    }

    insert() {
        if (this.insertRef.current.value == '') {
            this.messageRef.innerHTML = "Please Enter a Value";
            return;
        }
        this.messageRef.innerHTML = ''
        var value = Number(this.insertRef.current.value)
        if (this.state.process == false)
            this.setState({
                insert_val: value,
                delete_val: null,
                process: true
            })
    }

    delete_() {
        if (this.deleteRef.current.value == '') {
            this.messageRef.innerHTML = "Please Enter a Value";
            return;
        }
        this.messageRef.innerHTML = ''
        var value = Number(this.deleteRef.current.value)
        if (this.state.process == false)
            this.setState({
                insert_val: null,
                delete_val: value,
                process: true
            })
    }

    load_sample_set() {
        var sample = []
        if(this.state.nodes.length!=0)
        {
            alert("Tree not Empty!..")
            return
        }
        fetch('/sample')
            .then(resp => resp.json())
            .then(resp => {
                const canvas = this.canvasRef.current
                const c = canvas.getContext('2d')
                var root = this.state.root
                var nodes = this.state.nodes
                var sample_insert = (val)=>{
                    if (root == null || root.value == null) {
                        root = new node(c.canvas.width / 2, 50, c.canvas.width / 2, 50, `hsl(${Math.random() * 360},100%,50%)`, null, null, val, 1, 1, c)
                        nodes.push(root)
                        return
                    }
                    var temp = new node(null, null, null, null, `hsl(${Math.random() * 360},100%,50%)`, null, null, val, 1, 1, c)
                    var p = root, q = null, i = 1
                    while (p != null) {
                        q = p
                        if (p.value < val)
                            p = p.right
                        else
                            p = p.left
                        i++
                    }
                    if (q.value < val) {
                        q.right = temp
                        temp.currX = temp.posX = q.posX + c.canvas.width / Math.pow(2, i)
                        temp.currY = temp.posY = q.posY + 75
                        nodes.push(temp)
                    }
                    else {
                        q.left = temp
                        temp.currX = temp.posX = q.posX - c.canvas.width / Math.pow(2, i)
                        temp.currY = temp.posY = q.posY + 75
                        nodes.push(temp)
                    }
                }
                var array = resp[0].values[Math.floor(Math.random() * 3)]
                for (var i = 0; i < array.length; i++) {
                    sample_insert(array[i])
                    this.state.root = root
                    this.state.nodes = nodes
                }
                c.fillStyle = 'black'
                c.fillRect(0, 0, c.canvas.width, c.canvas.height)
                this.state.nodes.forEach((node) => {
                    node.draw()
                })
            })
    }

    render() {
        var mystyle = {
            border: "1px solid black"
        };
        return (
            <div className="d1">
                <motion.canvas initial={{x:-500}}animate={{x:0}} ref={this.canvasRef} {...this.props} className="canvas" style={mystyle} /><br />
                <motion.div initial={{x:500}}animate={{x:0}}>
                Enter the Element:  <input type="text" ref={this.insertRef}></input>
                <button onClick={this.insert}>Insert</button>
                <br />
                Enter the element: <input type="text" ref={this.deleteRef}></input>
                <button onClick={this.delete_}>Delete</button>
                <br />
                <button onClick={this.load_sample_set}>Insert Sample Data</button>
                <p ref={(el) => { this.messageRef = el }}></p>
                </motion.div>
            </div>
        );
    }
}

export default Canvas1
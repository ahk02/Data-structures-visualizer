import React from 'react'
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'

const ds = () => {
    return (
        < motion.div initial={{x:-500}} animate={{x:0}} style={{display:'flex', justifyContent:'space-evenly'}}>
            <Link to="/datastructures/linkedlist"><button style={{margin:'auto'}}>Linked list goes here</button></Link>
            <Link to="/datastructures/stacks"><button style={{margin:'auto'}}>Stacks goes here</button></Link>
            <Link to="/datastructures/bst"><button style={{margin:'auto'}}>BST goes here</button></Link>
            <Link to="/datastructures/linkedlist/theory"><button>Linked list theory goes here</button></Link>
            <Link to="/datastructures/stacks/theory"><button>Stacks theory goes here</button></Link>
            <Link to="/datastructures/bst/theory"><button>BST theory goes here</button></Link>
        </motion.div>
    )
}

export default ds

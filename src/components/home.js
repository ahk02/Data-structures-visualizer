import React from 'react'
import './home.css';
import {motion} from 'framer-motion'
import TypedReactHooksDemo from './typingeffect'
const Home = () => {
    return (
        <motion.div initial={{x:-500}} animate={{x:0}}className='homepage'>
            <TypedReactHooksDemo />
            <div>
                <strong><p>Welcome to Data Visualiser....</p></strong>
                <p>This project is made with the intention to assist in the visualization of commonly used data structures
                <br/>The data structures covered in this visualizer include Binary Search Trees, Linked Lists, and Stacks</p>
                <p>
                This project uses methods like requestAnimationFrame and cancelAnimationframe for the animations<br/>
The canvas displays the current frame of the animation and this is refreshed periodically to create the animation effect
                </p>
            </div>

        </motion.div>
    )
}
export default Home

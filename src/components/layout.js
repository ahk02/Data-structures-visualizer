import React from 'react'
import { Link } from 'react-router-dom'
import './Layout.css';
import { motion } from "framer-motion"
const Layout = () => {
    return (
        <motion.div initial={{x:-400}} animate={{x:0}} transition={{duration:0.3}}>
            <br></br>
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/datastructures'>DS</Link>
                    </li>
                </ul>
            </nav>
            <motion.div animate={{}} class="header" id="myHeader">
                <p class="font-effect-anaglyph" align="center">DS Visualiser</p>
            </motion.div>
        </motion.div>
    )
}

export default Layout
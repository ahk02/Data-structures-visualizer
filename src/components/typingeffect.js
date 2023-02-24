import React from 'react'
import './typingeffect.css';
import Typed from 'typed.js';
import { motion } from "framer-motion";
const TypedReactHooksDemo = () => {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);
  // Create reference to store the Typed instance itself
  const typed = React.useRef(null);

  React.useEffect(() => {
    const options = {
      strings: [
        '<strong>Learn</strong>',
        '<strong>Visualise</strong>',
        '<strong>Code</strong>'
      ],
      typeSpeed: 80,
      backSpeed: 60,
      loop:true,
      smartBackspace: true,
      showCursor: true,
    };

    // elRef refers to the <span> rendered below
    typed.current = new Typed(el.current, options);

    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current.destroy();
    }
  }, [])


  return (
    <motion.div initial={{x:-400}} animate={{x:0}} transition={{duration:0.2}} className="wrap" style={{display: 'flex', justifyContent: 'center'}}>

      <div className="type-wrap">
        <h1><span style={{ whiteSpace: 'pre' }} ref={el} /></h1>
      </div>
    </motion.div>
  );
}

export default TypedReactHooksDemo
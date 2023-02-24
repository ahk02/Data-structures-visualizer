import React from 'react'
const lltheory = () => {
    return (
        <div className='homepage'>
            <div>
                <p>Linked List....</p>
                <img src="ll1. gif" />
                <p>A linked list is a collection of data which is not stored in contiguous locations in the memory.
                    <br />Instead, each node in the linked list points to the next node.
                    Each node of a linked list contains a field to store the data and another field to enable access to the next node.</p>
                <p>
                    This allows efficient insertion to any position and efficent deletion of any element from any position.
                    A drawback of linked lists is that access time is linear and random access is not feasible.
                    <br />
                    Linked lists can be used to implement other data structures such as queues, stacks and graphs.
                </p>
            </div>

        </div>
    )
}
export default lltheory

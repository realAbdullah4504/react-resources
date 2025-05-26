import React, { useState } from 'react'
import RenderNotes from './RenderNotes';
import AddNotes from './AddNotes';

const initialNotes=[
    {
        id: 1,
        title: 'Note 1',
        description: 'This is the first note'
    },
    {
        id: 2,
        title: 'Note 2',
        description: 'This is the second note'
    },
    {
        id: 3,
        title: 'Note 3',
        description: 'This is the third note'
    },
]



const StateExample = () => {
    const [notes, setNotes] = useState(initialNotes)
    const handleAddNote = (note) => {
        const id = Math.random().toString(36).substring(2,5)
        const noteWithId={...note,id}
        setNotes(prev => [...prev, noteWithId])
    }
    const handleDeleteNote = (id) => {
        const filteredNotes = notes.filter(note => note.id !== id);
        setNotes(filteredNotes);
    };
    return (
        <div className="flex gap-[10px]">
            <AddNotes handleAddNote={handleAddNote} />
            <RenderNotes notes={notes} handleDeleteNote={handleDeleteNote}/>
        </div>
    )
}

export default StateExample

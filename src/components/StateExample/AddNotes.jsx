import React, { useState } from 'react'

const AddNotes = ({ handleAddNote, handleDeleteNote }) => {
    const [note, setNote] = useState({
        title: "",
        content: "",
        pinned: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("value", name, value, type, checked)
        setNote(prev => (
            {
                ...prev,
                [name]: type === "checked" ? checked : value
            }
        ))
    }
    return (
        <div>
            <div className="flex flex-col">
                <label>title</label>
                <input type="text" name="title" value={note.title} onChange={handleChange} />
            </div>
            <div className="flex flex-col">
                <label>content</label>
                <input type="text" name="content" value={note.content} onChange={handleChange} />
            </div>
            <div className="flex flex-col">
                <label>isPinned</label>
                <input type="checkbox" name="pinned" value={note.pinned} onChange={handleChange} />
            </div>
            <button className="px-2 rounded bg-black text-white cursor-pointer" onClick={() => handleAddNote(note)}>Add Note</button>
        </div>
    )
}

export default AddNotes

import React from 'react'

const RenderNotes = ({ notes,handleDeleteNote }) => {
    return (
        <div>
            {notes.map(note => (
                <div key={note._id}>
                    <div>note id {note._id}</div>
                    <p>{note.title}</p>
                    <p>{note.description}</p>
                    <button className="px-2 rounded bg-black text-white cursor-pointer" onClick={()=>handleDeleteNote(note._id)}>Delete note</button>
                    <div>-------------------</div>
                </div>
            ))}
        </div>
    )
}

export default RenderNotes

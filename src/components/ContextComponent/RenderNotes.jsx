import React from 'react'
import { useNotes } from '../../context/useNotes'

const RenderNotes = () => {
    const { notes, handleDeleteNote } = useNotes();
    // console.log("notes",notes)
    return (
        <div>
            {notes?.map(note => (
                <div>
                    <div>note # {note.id}</div>
                    <p>{note.title}</p>
                    <p>{note.content}</p>
                    <p>{note.pinned ? "it is pinned" : "not pinned"}</p>
                    <button className="px-2 rounded bg-black text-white cursor-pointer" onClick={() => handleDeleteNote(note.id)}>Delete note</button>
                    <div>-------------------</div>
                </div>
            ))}
        </div>
    )
}

export default RenderNotes

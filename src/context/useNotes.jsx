import { createContext, useContext, useState } from "react";

const NotesContext = createContext();
const initialNotes = [
    {
        id: 1,
        title: "Meeting Notes",
        content: "Discussed project roadmap and assigned tasks.",
        pinned: false,
    },
    {
        id: 2,
        title: "Shopping List",
        content: "Milk, Eggs, Bread, Butter",
        pinned: true,
    },
    {
        id: 3,
        title: "Ideas",
        content: "Build a note-taking app using React and localStorage.",
        pinned: false,
    }
];

export const NotesProvider = ({children}) => {
    const [notes, setNotes] = useState(initialNotes)


    const handleAddNote = (note) => {
        const id = Math.random().toString(36).substring(2, 5)
        const noteWithId = { ...note, id }
        setNotes(prev => [...prev, noteWithId])
    }
    const handleDeleteNote = (id) => {
        const filteredNotes = notes.filter(note => note.id !== id);
        setNotes(filteredNotes);
    };



    return (
        <NotesContext.Provider value={{notes, handleAddNote, handleDeleteNote }} >
            {children}
        </NotesContext.Provider>
    )
}

export const useNotes = () => useContext(NotesContext)
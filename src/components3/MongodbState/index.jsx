import React, { useState, useEffect } from 'react';
import RenderNotes from './RenderNotes';
import AddNotes from './AddNotes';

const MongodbState = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true); // for initial fetch
    const [actionLoading, setActionLoading] = useState(false); // for add/delete actions
    const [editableNote, setEditableNote] = useState();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/notes");
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const handleAddNote = async (newNote) => {
        try {
            setActionLoading(true);
            const response = await fetch('http://localhost:3000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNote)
            });
            const data = await response.json();
            setNotes(prev => [...prev, data]);
        } catch (error) {
            console.error("Add error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            setNotes(prev => prev.filter(note => note._id !== data._id));
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateNote = async (note) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            });
            const data = await response.json();
            setNotes(prev => prev.map(note => note._id === data._id ? data : note));
            setEditableNote(null);
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setActionLoading(false);
        }
    }

    const handleEditableNote = (note) => {
        setEditableNote(note)
    }

    if (loading) return <p>Loading notes...</p>;

    return (
        <div className="">
            <AddNotes handleAddNote={handleAddNote} handleUpdateNote={handleUpdateNote} editableNote={editableNote} />
            <RenderNotes notes={notes} handleDeleteNote={handleDeleteNote} handleEditableNote={handleEditableNote} />
        </div>
    );
};

export default MongodbState;

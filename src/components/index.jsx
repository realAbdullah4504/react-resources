import React, { useEffect, useState } from "react";
import RenderNotes from "./RenderNotes";
import AddNotes from "./AddNotes";

const MongodbState = ({ token }) => {
  const [editableNote, setEditableNote] = useState();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }
  }, [token]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) {
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/notes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchNotes();
  }, [token]);

  const handleAddNote = async (newNote) => {
    try {
      const response = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });
      const data = await response.json();
      setNotes((prev) => [...prev, data]);
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotes((prev) => prev.filter((note) => note._id !== data._id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUpdateNote = async (note) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/notes/${note._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(note),
        }
      );
      const data = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note._id === data._id ? data : note))
      );
      setEditableNote(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleEditableNote = (note) => {
    setEditableNote(note);
  };

  return (
    <div className="flex gap-4">
      <AddNotes
        handleAddNote={handleAddNote}
        handleUpdateNote={handleUpdateNote}
        editableNote={editableNote}
      />
      <RenderNotes
        notes={notes}
        handleDeleteNote={handleDeleteNote}
        handleEditableNote={handleEditableNote}
      />
    </div>
  );
};

export default MongodbState;

import React, { useEffect, useState } from 'react'

const AddNotes = ({ handleAddNote, editableNote, handleUpdateNote }) => {
  const [note, setNote] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    if (editableNote)
      setNote(editableNote)
  }, [editableNote])

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editableNote)
      handleUpdateNote(note)
    else
      handleAddNote(note)
    setNote({
      title: '',
      description: ''
    })
  }


  return (
    <div>
      <form >
        <input type="text" name="title" value={note.title} placeholder="Enter title" onChange={handleChange} />
        <input type='text' name="description" value={note.description} placeholder='Enter description' onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>{!editableNote ? "Add Note" : "Update Note"}</button>
      </form>
    </div>
  )
}

export default AddNotes

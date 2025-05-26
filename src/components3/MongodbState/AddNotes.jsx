import React, { useState } from 'react'

const AddNotes = ({handleAddNote}) => {
  const [note, setNote] = useState({
    title: '',
    description: ''
  })

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
      <form >
        <input type="text" name="title" value={note.title} placeholder="Enter title" onChange={handleChange}/>
        <input type='text' name="description" value={note.description} placeholder='Enter description' onChange={handleChange}/>
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          handleAddNote(note)}}>Add Note</button>
      </form>
    </div>
  )
}

export default AddNotes

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
      <form className='flex flex-col gap-2'>
        <input type="text" name="title" className='border-2 border-gray-300 rounded-md p-2' value={note.title} placeholder="Enter title" onChange={handleChange} />
        <input type='text' name="description" className='border-2 border-gray-300 rounded-md p-2' value={note.description} placeholder='Enter description' onChange={handleChange} />
        <button type="submit" className='px-2 rounded bg-black text-white cursor-pointer' onClick={handleSubmit}>{!editableNote ? "Add Note" : "Update Note"}</button>
      </form>
    </div>
  )
}

export default AddNotes
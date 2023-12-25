import React, { useContext } from 'react'
import noteContext from '../contexts/notes/noteContext';
import { useState } from 'react';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag: ""})
        props.showAlert("Note Added Successfully", "success");
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div className="container my-3">
            <h3>Add a Note</h3>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" name='title' id="title"  value={note.title} minLength={5} required onChange={onChange}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" value={note.description} name='description' minLength={5} required onChange={onChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" value={note.tag} id="tag" name='tag' minLength={5} required onChange={onChange} />
                </div>
                <button className='btn btn-primary' disabled={note.title.length < 5 || note.description.length < 5} type="submit" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote

import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../contexts/notes/noteContext';
import NotesItems from './NotesItems';
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getnotes, editnote } = context;

    let navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getnotes();
        }
        else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null)
    const [note, setNote] = useState({ etitle: "", edescription: "", etag: "", id: "" })
    const refClose = useRef(null)

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag, id: currentNote._id })
    }

    const handleClick = (e) => {
        // console.log("Updating the note...", note)
        editnote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Note Updated Successfully", "success");
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" name='etitle' id="etitle" value={note.etitle} placeholder="name@example.com" minLength={5} required onChange={onChange} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} minLength={5} required onChange={onChange} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' value={note.etag} minLength={5} required onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5} className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h3>Your Notes</h3>
                <div className="container mx-2">
                    {notes.length === 0 && "No Notes to display"}
                </div>
                {notes.map((note) => {
                    return <NotesItems key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes

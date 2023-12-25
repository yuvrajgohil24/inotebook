import React, { useContext } from 'react'
import noteContext from '../contexts/notes/noteContext';

const NotesItems = (props) => {
    const context = useContext(noteContext);
    const { deletenote } = context;
    const { note, updateNote } = props;

    return (
        <div className='col-md-3'>
            {/* {note.title}
            {note.description} */}
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center ">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-solid fa-trash mx-2" onClick={() => {deletenote(note._id); props.showAlert("Note Deleted Successfully", "success");}}></i>
                        <i className="fa-solid fa-pen-to-square mx-2" onClick={() => {updateNote(note)}}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NotesItems

import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = " http://localhost:5000"
    const notesInitial = []
    // const s1 = {
    //     "name" : "Yuvraj",
    //     "branch" : "IT"
    // }

    // const [state, setState] = useState(s1);

    // const update = () => {
    //     setTimeout(() => {
    //         setState({
    //             "name" : "Prince",
    //             "branch" : "AI"
    //         })
    //     }, 1200);
    // }

    const [notes, setNotes] = useState(notesInitial)

    //Get all Notes
    const getnotes = async() => {
         // API call
         const resposnse = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        
        const json = await resposnse.json()
        console.log(json)
        setNotes(json)
    }

    //Add Note
    const addNote = async(title, description, tag) => {
         // API call
         // eslint-disable-next-line
         const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        
        const note = await response.json();
        // console.log("Adding a new note")
        
        setNotes(notes.concat(note))
    }

    //Delete Note
    const deletenote = async(id) => {
         // API call
         const resposnse = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = resposnse.json()
        console.log(json)

        // Logic of deleting note in client 
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote)
    }

    //Edit Note
    const editnote = async (id, title, description, tag) => {
        // API call
        const resposnse = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag })
        });
        // eslint-disable-next-line
        const json = await resposnse.json()
        console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))

        //Logic to edit in Client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deletenote, editnote, getnotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
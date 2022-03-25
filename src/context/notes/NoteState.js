//! HERE WE WILL MAKE STATES WHICH CAN BE USED BY ANY COMPONENTS THROUGH NOTECONTEXT (USING DESTUCTURING METHOD IN THAT STATE) ,( Api Call code is from mozilla developer)
import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesinitial = [];

  const [notes, setNotes] = useState(notesinitial);

  //*STATE 1 :Add a Note
  const addNote = async (title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), //To send the requested data in form of json to backend by converting the json into string form
      //(it is only applied to API which send data to backend)
    });
    //Adding a Note
    const note = await response.json();
    setNotes(notes.concat(note)); //Here setNotes will concat notes and note object
  };

  //* STATE 2 :Get all Notes
  const getNotes = async () => {
    //API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        "auth-token": JSON.parse(JSON.stringify(localStorage.getItem("token"))),
      },
    });
    const json = await response.json();
    setNotes(json);
    console.log(json);
  };

  //*STATE 3:Delete a Note
  const deleteNote = async (id) => {
    //API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);

    //Deleting a note
    console.log("Deleting the note with id" + id);
    const deleteNotes = notes.filter((note) => {
      return note._id !== id;
    }); //filter always takes an arrow function,here filter will take a note using id to delete it
    setNotes(deleteNotes);
  };

  //*STATE 4:Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), //To send the requested data in form of json to backend by converting the json into string form
      //(it is only applied to API which send dat to backend)
    });

    //Logic to edit in client instantly
    const newNotes = JSON.parse(JSON.stringify(notes)); //*JSON.parse(JSON.stringify(notes)) => It's a way of cloning an object(here it is notes,

    //*  and cloned object is newNotes) so that you get a complete copy that is unique but has the same properties as the cloned object(notes).

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
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, getNotes, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;

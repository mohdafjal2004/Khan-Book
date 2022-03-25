//! HERE WE WANT TO ADD A NOTE SO WE WILL USE ADDNOTE STATE THROUGH NOTECONTEXT AND THEN DESTUCTURING  IT TO MAKE IT USABLE IN THIS COMPONENT
import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";

const AddNote = (props) => {
  const context = useContext(NoteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    //Once the form is filled it should be empty automatically and for that we use setNote with empty fields also the value should be assigned to input field
    props.showAlert("Added Successfully", "success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
    //...note means whatever properties note have , should exists but whatever we are writing should add or overwrite the properties of note
    //and during add or overwriting whatever property we have in name should be equal to value
  };
  return (
    <div>
      <h2>Add a Note</h2>
      <form>
        <div className="mb-3">
          <label typeof="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            aria-describedby="emailHelp"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label typeof="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onChange}
            minLength={5}
            required
            // minLength={5} required used here for validation and also the id of notes didnt fail
          />
        </div>
        <div className="mb-3">
          <label typeof="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
          />
        </div>

        <button
          disabled={note.title.length < 5 || note.description.length < 5}
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;

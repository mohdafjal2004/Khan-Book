//! 1 : HERE WE WANT TO GET ALL NOTES SO WE WILL USE GETNOTE STATE THROUGH NOTECONTEXT AND THEN DESTUCTURING  IT TO MAKE IT USABLE IN THIS COMPONENT
//! 2 : AND ALSO TO ALL THE NOTES WE GOT ON THEM WE WILL MAKE UPDATENOTE STATE
//! 3 : AFTER CLICKING ON  UPDATENOTE BUTTON , THE MODAL(EDIT DIALOG BOX) SHOULD CLOSE AND NOTE SHOULD BE UPDATED IN DATBASE AND IN FRONTEND

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";
import AddNote from "./AddNote";
import NoteItem from "./NoteItem";

const Notes = (props) => {
  const navigate = useNavigate();
  //!USE OF GETNOTES STATE
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  //! USE OF EDITNOTE STATE
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    // currentNote is used so that when use edit button then all the details previously filled should be populated ,
    // so etitle, edescription and etag which were previously empty will be filled by using SetNote function
    ref.current.click(); //So if Modal is Showing it will hide else vice-versa
    setNote({
      //for populating the previous detials in edit dialog box to edit them
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  //!FINALLY UPDATING THE NOTE ON CLICKING THE UPDATE NOTE BUTTON
  const handleClick = (e) => {
    console.log("Updating the Note", note);
    refClose.current.click();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    e.preventDefault(); //<= We dont want it , becoz the button is not part of form
    props.showAlert("Updated Successfully", "success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />

      <button
        type="button"
        ref={ref}
        className="btn btn-primary my-3 d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Edit Note Modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-etitle" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Content Inside Edit Dialog Box */}
              <form>
                <div className="mb-3">
                  <label typeof="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
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
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label typeof="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                  />
                </div>
              </form>
              {/* Edit Dialog Box Ends Here */}
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
                disabled={
                  note.etitle.length < 5 || note.edescription.length < 5
                }
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fetching notes */}
      
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && "No Notes to display"}
        </div>
        <>
          {notes.map((note) => {
            return (
              <NoteItem
                key={note._id}
                updateNote={updateNote}
                showAlert={props.showAlert}
                note={note}
              />
            );
          })}
        </>
      </div>
    </>
  );
};

export default Notes;

//! 2 : AND ALSE HERE WE WANT TO UPDATE A NOTE SO WE WILL USE UPDATENOTE  STATE THROUGH NOTECONTEXT AND THEN DESTUCTURING  IT TO MAKE IT USABLE IN THIS COMPONENT AND 

import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  return (
    <div className="col md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p> 

          {/*Icon for Deleting a Note */}
          <i
            className="fa-solid fa-trash mx-2"
            onClick={() => {deleteNote(note._id); props.showAlert("Deleted Successfully" , "success")}}
          ></i>

          {/*Icon for Updating a Note */}
          <i
            className="fa-solid fa-pen-to-square mx-2"
            onClick={() => {
              updateNote(note);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;

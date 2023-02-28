import { convertToRaw } from "draft-js";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import drafToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewEditor(props) {
  const [editorState, setEditorState] = useState("");
  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={(editorState) => setEditorState(editorState)}
      onBlur={() => {
        console.log(drafToHtml(convertToRaw(editorState.getCurrentContent())));
        props.getContent(
          drafToHtml(convertToRaw(editorState.getCurrentContent()))
        );
      }}
    />
  );
}

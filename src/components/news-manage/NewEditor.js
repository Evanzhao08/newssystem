import { convertToRaw, EditorState, ContentState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import drafToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewEditor(props) {
  const [editorState, setEditorState] = useState("");
  useEffect(() => {
    console.log("content", props.content);
    const html = props.content;
    if (html === undefined) return;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [props.content]);
  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={(editorState) => setEditorState(editorState)}
      onBlur={() => {
        // console.log(drafToHtml(convertToRaw(editorState.getCurrentContent())));
        props.getContent(
          drafToHtml(convertToRaw(editorState.getCurrentContent()))
        );
      }}
    />
  );
}

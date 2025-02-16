import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function Textedito({content,setContent}:any) {
  // State to store the editor content
//   const [content, setContent] = useState("");

  // Handler to capture content changes
  const handleEditorChange = (newContent:any) => {
    setContent(newContent);
    console.log("Editor Content:", newContent); // Log the content for debugging
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">TinyMCE Editor</h1>
      <Editor
        apiKey="adcqj94qbelb4hxl3u8hliljc3kyf2ceq2flqhen709xvi3b"
        onEditorChange={handleEditorChange} // Capture content changes
        init={{
          height: 600, // Set a comfortable height
          width: "100%", // Make the editor full-width
          menubar: false, // Disable the menu bar to simplify the UI
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
          ],
          toolbar:
            "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | codesample emoticons charmap | removeformat",
          toolbar_mode: "wrap", // Wrap toolbar buttons to multiple lines if needed
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }", // Customize content style
        }}
        initialValue="" // Initial content
      />
    
    </div>
  );
}
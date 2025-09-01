import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function Textedito({ content, setContent }: { content: string; setContent: (value: string) => void }) {
  return (
    <div className="p-5 w-full">
      <h1 className="text-xl font-bold mb-4">TinyMCE Editor</h1>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY!}
        value={content} // Controlled value
        onEditorChange={(newContent) => setContent(newContent)} // Update content on change
        init={{
          height: 600,
          width: "100%",
          menubar: false,
          plugins: [
            "anchor", "autolink", "charmap", "codesample",
            "emoticons", "image", "link", "lists",
            "media", "searchreplace", "table",
            "visualblocks", "wordcount"
          ],
          toolbar:
            "undo redo | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "codesample emoticons charmap | removeformat",
          toolbar_mode: "wrap",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
      />
    </div>
  );
}

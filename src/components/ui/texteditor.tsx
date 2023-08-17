import React, { useState, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./button";
import {
  Bold,
  Heading,
  Italic,
  ListIcon,
  ListOrdered,
  Strikethrough,
} from "lucide-react";

type TextEditorProps = {
  htmlContent?: (html: string) => void;
  value?: string;
  clearContent?: boolean;
  className?: string;
  label?: string
};

const TextEditor: React.FC<TextEditorProps> = ({
  htmlContent,
  clearContent,
  className,
  label,
  value= "<p>Start writing....</p>",
}) => {
  const [isEditable] = useState(true);
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
  });

  const html = editor?.getHTML();
  // console.log(html);
  // const clearContenty = editor?.commands.clearContent()

  if (clearContent) {
    editor?.commands.clearContent();
  }

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
      htmlContent?.(html as string);
    }
  }, [editor, isEditable, html, htmlContent]);

  return (
    <div className="flex flex-col gap-2 mb-3">
      <label htmlFor={label} className="text-sm font-semibold">
        {label}
      </label>
      <div className={`prose dark:text-white  grid !max-w-full grid-rows-1 prose-p:my-0 prose-li:-my-2 ${className as string}`}>
        <EditorContent editor={editor} />
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 200 }}
            className="bg-white dark:bg-background"
          >
            <Button
              type="button"
              size="icon"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              variant={editor.isActive("bold") ? "default" : "ghost"}
            >
              <Bold />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              variant={editor.isActive("italic") ? "default" : "ghost"}
            >
              <Italic />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              variant={editor.isActive("strike") ? "default" : "ghost"}
            >
              <Strikethrough />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
            >
              <ListOrdered />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
            >
              <ListIcon />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              variant={editor.isActive("heading") ? "default" : "ghost"}
            >
              <Heading />
            </Button>
          </BubbleMenu>
        )}
      </div>
    </div>
  );
};

export default TextEditor;

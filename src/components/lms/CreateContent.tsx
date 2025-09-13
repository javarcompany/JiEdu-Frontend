import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";

interface Props {
  content: string;
  readOnly?: boolean;
  onChange?: (json: string) => void;
}

export default function DocumentEditor({ content, readOnly = false, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({
        controls: true,
        modestBranding: true,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content ? JSON.parse(content) : "",
    editable: !readOnly,
    onUpdate({ editor }) {
      if (onChange) {
        onChange(JSON.stringify(editor.getJSON()));
      }
    },
  });

  if (!editor) return null;

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-900 shadow-md">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-blue-100" : ""}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-blue-100" : ""}
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-blue-100" : ""}
          >
            <UnderlineIcon size={18} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List size={18} />
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => {
              const url = prompt("Enter link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            <LinkIcon size={18} />
          </button>
          <button
            onClick={() => {
              const url = prompt("Enter image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            <ImageIcon size={18} />
          </button>

          {/* Insert YouTube */}
          <button onClick={addYoutubeVideo}>
            <YoutubeIcon size={18} />
          </button>

          {/* Table Controls */}
          <button onClick={insertTable}>
            <TableIcon size={18} />
          </button>
          {editor.isActive("table") && (
            <div className="flex gap-1">
              <button onClick={() => editor.chain().focus().addRowAfter().run()}>+Row</button>
              <button onClick={() => editor.chain().focus().addColumnAfter().run()}>+Col</button>
              <button onClick={() => editor.chain().focus().deleteRow().run()}>-Row</button>
              <button onClick={() => editor.chain().focus().deleteColumn().run()}>-Col</button>
              <button onClick={() => editor.chain().focus().deleteTable().run()}>Del Table</button>
            </div>
          )}
        </div>
      )}

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="prose lg:prose-lg dark:prose-invert max-w-none p-6 min-h-[500px] bg-white shadow-inner focus:outline-none"
      />
    </div>
  );
}

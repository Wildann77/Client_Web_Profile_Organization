import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { uploadApi } from '@/features/articles/api';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const TiptapEditor = ({
  content,
  onChange,
  placeholder = 'Mulai menulis artikel...',
  className
}: TiptapEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'rounded-lg max-w-full' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline font-medium' },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Image Upload Handler
  const addImage = useCallback(async (file: File) => {
    if (!editor) return;

    setIsUploading(true);
    try {
      // Compress image before upload
      const { compressImage } = await import('@/shared/lib/imageCompression');
      const compressedFile = await compressImage(file);

      const result = await uploadApi.uploadImage(compressedFile);
      editor.chain().focus().setImage({ src: result.secureUrl }).run();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  // Add link
  const addLink = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('Masukkan URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-md transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent text-muted-foreground hover:text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-card text-foreground', className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
        {/* Text formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Headings */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Lists */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Other */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>

          {/* Image Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && addImage(e.target.files[0])}
              className="hidden"
              id="editor-image-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="editor-image-upload"
              className={cn(
                'p-2 rounded-md transition-colors cursor-pointer flex items-center',
                'hover:bg-accent text-muted-foreground hover:text-accent-foreground',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}
              title="Upload Image"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </label>
          </div>
        </div>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
};

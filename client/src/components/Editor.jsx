// Editor.jsx
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseBorder = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(100, 108, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(100, 108, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(100, 108, 255, 0); }
`;

// Styled components
const EditorContainer = styled.div`
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  margin: 1.5rem 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EditorWrapper = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  min-height: 200px;

  &:focus-within {
    border-color: #646cff;
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
    animation: ${pulseBorder} 1.5s infinite;
  }

  .ProseMirror {
    outline: none;
    min-height: 150px;
    
    p {
      margin-bottom: 1rem;
      line-height: 1.6;
      color: #334155;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 1.5rem 0 1rem;
      color: #1e293b;
      font-weight: 600;
    }

    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    blockquote {
      border-left: 4px solid #646cff;
      padding-left: 1rem;
      margin-left: 0;
      color: #64748b;
      font-style: italic;
    }

    code {
      background: #f1f5f9;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    pre {
      background: #1e293b;
      color: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow-x: auto;
      
      code {
        background: transparent;
        padding: 0;
        color: inherit;
      }
    }

    a {
      color: #646cff;
      text-decoration: none;
      transition: all 0.2s ease;
      
      &:hover {
        color: #4f46e5;
        text-decoration: underline;
      }
    }
  }
`;

const FloatingLabel = styled.span`
  position: absolute;
  top: -10px;
  left: 15px;
  background: white;
  padding: 0 10px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  z-index: 1;
  transition: all 0.3s ease;
`;

const Editor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <EditorContainer>
      <FloatingLabel>Blog Content</FloatingLabel>
      <EditorWrapper>
        <EditorContent editor={editor} />
      </EditorWrapper>
    </EditorContainer>
  );
};

export default Editor;
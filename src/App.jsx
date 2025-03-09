import { useState, useEffect, useRef } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import Prism from 'prismjs'
import Markdown from 'react-markdown'
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import Navbar from './components/Navbar'
import Modal from './components/Modal'



function App() {
  

  const [code, setCode] = useState(() => {
    return localStorage.getItem("code") || ""; // Load saved code from localStorage
  })

  const [review, setReview] = useState(``)

  const [loading, setLoading] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);

  const editorRef = useRef(null);

  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const [copied, setCopied] = useState(false);


  const handleCopyReview = () => {
    navigator.clipboard.writeText(review); // Copy to clipboard
    setCopied(true); // Show "Copied!" message

    // Hide the message after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };



  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  



  const openModal = (type) => {
    setModalTitle(type);
    setModalOpen(true);

    if (type === "Settings") {
      setModalContent(
        <div>
          <label>
            Font Size:
            <select>
              <option>12px</option>
              <option>14px</option>
              <option>16px</option>
              <option>18px</option>
              
            </select>
          </label>
          
          <label>
            
            Tab Size:
            <select>
              <option>2 Spaces</option>
              <option>4 Spaces</option>
            </select>
          </label>
          <label>
            <input type="checkbox" /> Show Line Numbers
          </label>
        </div>
      );
    } else if (type === "Help") {
      setModalContent(
        <div>
          <p><strong>Keyboard Shortcuts:</strong></p>
          <p>💾 Ctrl + S → Save</p>
          <p>⌨️ Ctrl + / → Comment Line</p>
          <p>⚡ How to Use CodeTrue?</p>
          <p>1. Type or upload your code.</p>
          <p>2. Click **Review** to get AI feedback.</p>
        </div>
      );
    }
  };

  


  


  useEffect(() => {
    Prism.highlightAll()
  }, [])

  


  async function reviewCode() {

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, { code });
      setReview(response.data);
      
    } catch (error) {
      setReview("WRITE SOME CODE!");
    }

    

    setLoading(false);

  }


  return (
    

    <div className='app-container'>

    <Navbar onFileUpload={setCode} onOpenModal={openModal}/>
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>

    {modalContent}

    </Modal>
    
    

    <main>


      <div className="left" style={{ flexBasis: `${leftWidth}%` }}>
        <div className="code" contentEditable="true" spellCheck="false" >

        
          <Editor
          ref={editorRef}
          value={code}
          onValueChange={newCode => {
            const pairs = { "{": "}", "(": ")", "[": "]", '"': '"', "'": "'" }; // Auto-close pairs
            const lastChar = newCode.slice(-1); // Last typed character
            const prevChar = code.slice(-1); // Previously typed character
          
            if (pairs[lastChar]) {
              // Only auto-close quotes if there's no existing closing quote nearby
              if ((lastChar === '"' || lastChar === "'") && prevChar === lastChar) {
                setCode(newCode); // Don't insert duplicate quotes
              } else {
                setCode(newCode + pairs[lastChar]); // Auto-insert closing pair
              }
            } else if (prevChar && pairs[prevChar] === lastChar && newCode.length < code.length) {
              // If deleting an empty pair, remove both
              setCode(newCode.slice(0, -1));
            } else {
              setCode(newCode);
            }
          }}
          
          
          

          highlight={code => Prism.highlight(code, Prism.languages.javascript, "javascript")}
          padding={10}
          style={{
            fontSize: 16,
              fontFamily: 'Fira Code, monospace',
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              height: "100%",
              overflowY: "auto",
              width: "100%",

              

          }}

          

          
          />
        </div>

        <div 
        onClick={reviewCode}
        className={`review ${loading ? 'loading' : ''}`}> {loading ? "Reviewing..." : "Review"}
        </div>

          <div className="clear-btn-container">
    <button className="clear-btn" onClick={() => { setCode(""); localStorage.removeItem("code"); }}>
      🗑️ Clear Code
    </button>
  </div>

      </div>


      <div className="resizer" onMouseDown={(e) => {
        const startX = e.clientX;
        const startWidth = leftWidth;
        
        function onMouseMove(e) {
          const newWidth = Math.min(Math.max(startWidth + (e.clientX - startX) / window.innerWidth * 100, 30), 70);
          setLeftWidth(newWidth);
        }

        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }}>

      </div>

      <div className="right" style={{ flexBasis: `${100 - leftWidth}%` }}>
  <div className="review-header">
    <h3>AI Review</h3>

     {review && (
    <button className="copy-btn" onClick={handleCopyReview}>
      {copied ? "Copied!" : "Copy Review"}
    </button>
  )}
  </div>

  {/* Show the placeholder bar ONLY when there is NO review */}
  {!review && <div className="review-placeholder">CODE REVIEW WILL APPEAR HERE</div>}

  {/* Show actual review when it's available */}
  {review && (
    <Markdown rehypePlugins={[rehypeHighlight]}>
      {review}
    </Markdown>
  )}
</div>


    </main>

    </div>


    
  )
}




export default App

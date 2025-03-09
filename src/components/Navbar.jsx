import { UploadCloud, Settings, HelpCircle } from "lucide-react";
import "./Navbar.css"; // Import styles

function Navbar({ onFileUpload, onOpenModal }) {
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileUpload(e.target.result); // Pass file content to App.jsx
      };
      reader.readAsText(file); // Read file as text
    }
  };

  return (
    <nav className="navbar">
      <h1 className="app-title">Code<span style={{ color: '#6a11cb' }}>True</span></h1>


      <div className="nav-actions">
        <label className="icon-btn">
          <UploadCloud size={20} /> Upload File
          <input type="file" accept=".js,.py,.txt,.java,.cpp" onChange={handleFileChange} hidden />
        </label>
        <button className="icon-btn" onClick={() => onOpenModal("Settings")}>
          <Settings size={20} />
        </button>
        <button className="icon-btn" onClick={() => onOpenModal("Help")}>
          <HelpCircle size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
import "./Modal.css";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

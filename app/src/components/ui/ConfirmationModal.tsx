import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-indigo-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

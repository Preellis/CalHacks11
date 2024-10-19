"use client";

import React, { useState } from 'react';
import { Modal, Button, FileInput, rem } from '@mantine/core';

interface UploadModalProps {
  opened: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ opened, onClose }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // WHAT IS THE ENDPOINT
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('File uploaded successfully!');
        setFile(null);
        onClose();
      } else {
        console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload File"
      centered
      size="lg"
    >
      <FileInput
        placeholder="Choose a file"
        label="File Upload"
        value={file}
        onChange={handleFileChange}
        accept="image/*,audio/*" // no video right?
        required
      />
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleUpload}
          disabled={!file}
          style={{ marginRight: rem(10) }}
        >
          Upload
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default UploadModal;

"use client";

import { useState } from 'react';
import { Button, Group, rem } from '@mantine/core';
import { IconPhoto, IconCamera, IconMicrophone } from '@tabler/icons-react';
import Link from 'next/link';
import UploadModal from '../upload/UploadModal';

export default function Footer() {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [uploadModalOpened, setUploadModalOpened] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full justify-between items-center shadow-md">        
      <Group className="w-full flex justify-between items-center py-4 px-6 shadow-md">
        <Button
          variant="outline"
          radius="lg"
          leftSection={<IconPhoto style={iconStyle} />}
          className="w-full flex items-center justify-center" 
          onClick={() => setUploadModalOpened(true)} 
        >
        </Button>

        <Link href="/camera" className="w-full">
          <Button
            variant="outline"
            radius="lg"
            leftSection={<IconCamera style={iconStyle} />}
            className="w-full flex items-center justify-center" 
          >
          </Button>
        </Link>

        <Button
          variant="outline"
          radius="lg"
          leftSection={<IconMicrophone style={iconStyle} />}
          className="w-full flex items-center justify-center" 
        >
        </Button>
      </Group>

      <UploadModal 
        opened={uploadModalOpened} 
        onClose={() => setUploadModalOpened(false)} 
      />
    </div>
  );
}

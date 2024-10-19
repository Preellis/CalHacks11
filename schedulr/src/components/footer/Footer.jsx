// components/footer/Footer.tsx
import { Button, Group } from '@mantine/core';
import { IconPhoto, IconCamera, IconMicrophone } from '@tabler/icons-react';

export default function Footer() {
  return (
    <div className="w-full fixed bottom-0 bg-gray-100 shadow-md py-4">
      <Group position="apart" grow className="px-6">
        <Button
          variant="outline"
          radius="lg"
          leftIcon={<IconPhoto />}
          className="w-full"
        >
          Gallery
        </Button>

        <Button
          variant="outline"
          radius="lg"
          leftIcon={<IconCamera />}
          className="w-full"
        >
          Camera
        </Button>

        <Button
          variant="outline"
          radius="lg"
          leftIcon={<IconMicrophone />}
          className="w-full"
        >
          Voice-to-Text
        </Button>
      </Group>
    </div>
  );
}

// components/navbar/Navbar.tsx
"use client";

import { Menu, Avatar, UnstyledButton, MenuItem, Group, Text, Button, rem } from '@mantine/core';
import { IconCalendar, IconUserCircle, IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function Navbar() {
  const userName = "Guest";
  const iconStyle = { width: rem(18), height: rem(18) };


  return (
    <div className="w-full flex justify-between items-center py-4 px-6 shadow-md">
      <Group>
      <Link href="/" className="w-full">
          <Button
            variant="outline"
            radius="lg"
            leftSection={<IconHome style={iconStyle} />}
            className="w-full flex items-center justify-center" 
          >
          </Button>
        </Link>
        </Group>

      <Group>
          <Text className="text-lg font-bold">@chat fix name</Text>
      </Group>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton>
            <Avatar radius="xl" size="md">
              {userName.charAt(0)}
            </Avatar>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Hi, {userName}</Menu.Label>
          <MenuItem icon={<IconCalendar size={16} />}>
            <Link href="https://calendar.google.com/" target="_blank">
              View Calendar
            </Link>
          </MenuItem>
          <MenuItem icon={<IconUserCircle size={16} />}>
            Profile
          </MenuItem>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

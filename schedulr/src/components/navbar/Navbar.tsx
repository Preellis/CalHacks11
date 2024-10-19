// components/navbar/Navbar.tsx
"use client";

import { Menu, Avatar, UnstyledButton, MenuItem, Group, Text } from '@mantine/core';
import { IconPhoto, IconCalendar, IconUserCircle, IconMessageCircle } from '@tabler/icons-react';
import Link from 'next/link';

export default function Navbar() {
  const userName = "Guest";

  return (
    <div className="w-full flex justify-between items-center py-4 px-6 shadow-md">
      <Link href="/">
        <span>@chat fix name</span>
      </Link>

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

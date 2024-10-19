// components/navbar/Navbar.tsx
"use client";

import { Menu, Avatar, UnstyledButton, MenuItem, Group, Text } from '@mantine/core';
import { IconLogout, IconCalendar, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Guest';

  return (
    <div className="w-full flex justify-between items-center py-4 px-6 bg-gray-100 shadow-md">
      <Link href="/">
        <a className="text-lg font-bold">My AI Planner</a>
      </Link>

      <Group spacing="xl">
        <Link href="/">
          <Text component="a" variant="link">Home</Text>
        </Link>
        <Link href="/about">
          <Text component="a" variant="link">About</Text>
        </Link>
        <Link href="/contact">
          <Text component="a" variant="link">Contact</Text>
        </Link>
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
          <MenuItem color="red" icon={<IconLogout size={16} />} onClick={() => signOut()}>
            Logout
          </MenuItem>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

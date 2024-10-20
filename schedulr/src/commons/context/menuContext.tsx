import { createContext } from 'react';

type MenuContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const MenuContext = createContext<MenuContextType>([false, () => {}]);
import { useRef, useState } from 'react';
import { useSocket } from '../context/socket_context';

export const UserProfile = () => {
  const { userName, setUserName, setUserProfile } = useSocket();
  const newDisplayNameRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState<string>(userName || '');
  const [avatar, setAvatar] = useState('🐱');
  const [themeColor, setThemeColor] = useState('#000000');

  const handleSaveProfile = () => {
    const displayName = newDisplayNameRef.current?.value || '';
    setUserName(userName);
    setUserProfile?.({ displayName, avatar, themeColor })
  }

  return (
    <div>
        <div>
            <input type="text" placeholder='display name' ref={newDisplayNameRef} />
            <button onClick={handleSaveProfile}>save</button>
        </div>
    </div>
) 
};

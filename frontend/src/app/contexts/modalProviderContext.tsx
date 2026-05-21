import { createContext, useState } from "react";
import { ProfileModal } from "../../ui/pages/profile";
import type { User } from "../interfaces/user";

interface ModalProviderValue {
  openModal: (user: User) => void;
  closeModal: () => void;
}

export const ModalProviderContext =
  createContext({} as ModalProviderValue);

export const ModalProvider  = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openProfileModal, setProfileModal] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  function handleOpenProfileModal(user: User) {
    setSelectedUser(user);
    setProfileModal(true);
  }

  function handleCloseProfileModal() {
    setProfileModal(false);
    setSelectedUser(null);
  }

  return (
    <ModalProviderContext.Provider
      value={{
        closeModal: handleCloseProfileModal,
        openModal: handleOpenProfileModal,
      }}
    >
      {children}

      {selectedUser && (
        <ProfileModal
          isOpen={openProfileModal}
          onClose={handleCloseProfileModal}
          user={selectedUser}
        />
      )}
    </ModalProviderContext.Provider>
  );
};
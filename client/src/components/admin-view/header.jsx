import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import PropTypes from 'prop-types';
import UserCartWrapper from '../shopping-view/cart-wrapper'; // Assuming the UserCartWrapper is in the correct path

export default function AdminHeader({ setOpen }) {
  AdminHeader.propTypes = {
    setOpen: PropTypes.func.isRequired,
  };
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

const HeaderRightContent = ({ cartItems }) => {
  return (
    <div>
      <UserCartWrapper cartItems={cartItems} />
    </div>
  );
};

// PropTypes validation for cartItems
HeaderRightContent.propTypes = {
  cartItems: PropTypes.array.isRequired,
};

// Exporting both components
export { AdminHeader, HeaderRightContent };

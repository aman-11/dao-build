import { useMoralis } from "react-moralis";

function Header({ account }) {
  const { logout } = useMoralis();
  return (
    <header className="flex border-b justify-end bg-gray-900">
      <div className="flex text-xs flex-col mt-2 mb-2 space-y-2 text-white">
        {account && (
          <p className="mr-16 text-xs font-normal">
            Hello, {account.slice(0, 4)}...
            {account.slice(account.length - 4)}
          </p>
        )}
        <div>
          <button
            onClick={logout}
            className="text-sm font-bold underline underline-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const Avatar = () => {
  const { user } = useAuth0();
  return (
        <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
                <img
                    src={user && user.picture}
                    alt="Profile"
                />
            </div>
        </label>
    )
}
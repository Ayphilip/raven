import { useAddress } from "@chopinframework/react";
 
function MyComponent() {
const { address, isLoading, isLoginError, login, logout, revalidate } = useAddress();
 
    if (isLoading) {
        return <div>Loading...</div>;
    }
 
    if (isLoginError) {
        return <div>Error logging in</div>;
    }
 
    if (address) {
        return (
            <div>
                <p>Logged in as {address}</p>
                <button onClick={logout}>Logout</button>
                <button onClick={revalidate}>Refresh</button>
            </div>
        );
    }
 
    return <button onClick={login}>Login</button>;
}
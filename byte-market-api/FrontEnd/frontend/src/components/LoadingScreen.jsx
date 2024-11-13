import PageLayout from "./Layout.jsx";
import { useAuth } from "./AuthProvider.jsx";

function LoadingScreen() {
    const {userid} = useAuth();

    return (
        <>
            <PageLayout>
                <div className="container">
                    <h1 style={{width}}>LOADING PLEASE WAIT</h1>
                </div>
            </PageLayout>
        </>
    )
}
export default LoadingScreen;
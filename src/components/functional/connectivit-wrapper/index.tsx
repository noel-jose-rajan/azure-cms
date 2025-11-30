import {
    ReactNode
} from "react";
// import { LoadingOutlined } from "@ant-design/icons";

// import Storage from "../../../lib/storage";
// import LOCALSTORAGE from "../../../constants/local-storage";
// import { useTheme } from "../../../context/theme";
// import ENV from "../../../constants/env";
// import { useAuth } from "../../../context/auth";

// const { Text } = Typography;

const ConnectivityWrapper = ({ children }: { children: ReactNode }) => {

    return children


    /*


    const { theme } = useTheme();
    const { logout } = useAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isBackendAvailable, setIsBackendAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [retrying, setRetrying] = useState(false);

    const backendUrl = ENV.API_URL_LEGACY + "/user/get-details";
    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    let timeoutId: any;

    // Check if the current URL is for the login page
    const isLoginPage = window.location.pathname === "/auth/login";

    if (isLoginPage) {
        // If the current page is the login page, return only the children
        return <>{children}</>;
    }

    const checkBackendStatus = async () => {
        setIsLoading(true);

        try {
            const controller = new AbortController();
            const signal = controller.signal;

            timeoutId = setTimeout(() => {
                controller.abort();
            }, 10000); // 10 seconds timeout

            const response = await fetch(backendUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                signal,
            });

            if (response.ok) {
                setIsBackendAvailable(true);
            } else {
                setIsBackendAvailable(false);
            }
        } catch (error) {
            setIsBackendAvailable(false); // Treat errors and timeouts as backend failure
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false); // Stop loading regardless of success or failure
            setRetrying(false); // Reset retrying state after completion
        }
    };

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(true);
        const handleOfflineStatus = () => setIsOnline(false);

        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOfflineStatus);

        checkBackendStatus(); // Initial backend check

        const interval = setInterval(() => {
            if (isOnline) {
                checkBackendStatus(); // Periodic check
            }
        }, 10000); // Check every 10 seconds

        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOfflineStatus);
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, [isOnline]);

    const handleRetry = () => {
        setRetrying(true);
        setIsBackendAvailable(false); // Ensure backend status is reset for a fresh check
        setTimeout(() => {
            // Trigger backend status check after a small delay
            if (isOnline) {
                checkBackendStatus();
            }
        }, 1000);
    };

    if (isLoading && !isBackendAvailable) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: theme.colors.background }}>
                <LoadingOutlined style={{
                    fontSize: "3rem",
                    color: theme.colors.text
                }} />
                <Text style={{ marginTop: 16, fontSize: 16, color: theme.colors.text }}>
                    {retrying ? "Trying to reconnect..." : "Loading, please wait..."}
                </Text>
            </div>
        );
    }

    if (!isOnline || !isBackendAvailable) {
        const errorMessage = !isOnline
            ? {
                title: "No Internet Connection",
                description: "Please check your internet connection and try again.",
                titleAr: "لا يوجد اتصال بالإنترنت",
                descriptionAr: "يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
            }
            : {
                title: "Backend Unavailable",
                description: "The backend server is not reachable. Please try again later.",
                titleAr: "الخادم غير متاح",
                descriptionAr: "الخادم غير متصل. يرجى المحاولة مرة أخرى لاحقًا.",
            };

        return (
            <Result
                style={{ backgroundColor: theme.colors.background, height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                status="error"
                title={
                    <div style={{ color: theme.colors.text }}>
                        <div>{errorMessage.title}</div>
                        <div style={{ direction: "rtl", marginTop: "10px" }}>{errorMessage.titleAr}</div>
                    </div>
                }
                subTitle={
                    <div style={{ color: theme.colors.text }}>
                        <div>{errorMessage.description}</div>
                        <div style={{ direction: "rtl", marginTop: "10px" }}>{errorMessage.descriptionAr}</div>
                    </div>
                }
                extra={
                    <>
                        <Button disabled={!isBackendAvailable && isLoading} onClick={handleRetry}>
                            {!isBackendAvailable && isLoading ? "Retrying" : "Retry / إعادة المحاولة"}
                        </Button>
                        <Button onClick={logout}>
                            Logout
                        </Button>
                    </>
                }
            />
        );
    }

    return <>{children}</>;

    */
};

export default ConnectivityWrapper;

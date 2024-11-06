import Sidebar from "../components/Sidebar";
import { ResetCookiesProvider } from "../components/ResetCookiesContext";



export default function RootLayout({ children }) {
  return (
    <ResetCookiesProvider>
      <div className="flex flex-row h-screen">
        <Sidebar />
        <div className="ml-64 flex-1 overflow-y-auto bg-gray-100 px-6 py-5">
       
          {children}
        </div>
      </div>
    </ResetCookiesProvider>
  );
}

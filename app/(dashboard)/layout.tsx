import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { PropsWithChildren } from "react"

const layout = ({children}:PropsWithChildren) => {
  return (
    <main className="grid lg:grid-cols-5">
         <div className=" hidden lg:block lg:col-span-1 lg:min-h-screen">
            <Sidebar />
         </div>
         <div className="lg:col-span-4">
          <Navbar />
          { children }
         </div>
    </main>
  )
}

export default layout
import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/home.page"
import { About } from "./pages/about.page"

export function App( ) {
    return (
        <Routes>
            <Route key="/about" path="/about" element={<About />} />
            <Route key="/" path="/" element={<Home />} />
        </Routes>
    )
}

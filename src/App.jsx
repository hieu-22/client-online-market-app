import React from "react"
import { path } from "./utils/constant"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Breadcrumb from "./components/Breadcrumb"
import Homepage from "./features/Home/Homepage"
import LoginForm from "./features/Auth/LoginForm"
const App = () => {
    return (
        <main>
            <Routes>
                <Route path={path.HOME} element={<Layout />}>
                    <Route index element={<Homepage />} />
                </Route>
                <Route path={path.LOGIN} element={<LoginForm />}></Route>
            </Routes>
        </main>
    )
}

export default App

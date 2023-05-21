import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Homepage from "./features/Home/Homepage"
import LoginForm from "./features/Auth/LoginForm"
import RegisterForm from "./features/Auth/RegisterForm"

import AuthorizedUserPage from "./features/Auth/AuthorizedUserPage"
import OtherUserPage from "./features/User/OtherUserPage"
import PhoneNumberForm from "./features/Auth/PhoneNumberForm"
import AddPostPage from "./features/Post/AddPostPage"
import SinglePostPage from "./features/Post/SinglePostPage"
import UserSettingPage from "./features/User/UserSettingPage"
import ChatPage from "./features/Chat/ChatPage"
import PostDashboard from "./features/Post/PostDashboard"

const App = () => {
    return (
        <main>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path="login" element={<LoginForm />} />
                    <Route path="register" element={<RegisterForm />} />
                    <Route
                        path="login/add-phone-number"
                        element={<PhoneNumberForm />}
                    />
                    <Route path="user/:userId" element={<OtherUserPage />} />
                    <Route
                        path="user/setting/profile"
                        element={<UserSettingPage />}
                    />
                    <Route
                        path="user/myProfile"
                        element={<AuthorizedUserPage />}
                    />

                    <Route path="posts/new-post" element={<AddPostPage />} />
                    <Route path="posts/:postUrl" element={<SinglePostPage />} />

                    <Route path="chat" element={<ChatPage />} />

                    <Route
                        path="/dashboard/posts"
                        element={<PostDashboard />}
                    />
                </Route>
            </Routes>
        </main>
    )
}

export default App

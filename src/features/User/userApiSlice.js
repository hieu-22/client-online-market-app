import { apiSlice } from "../../app/api/apiSlice"

// create user api slice
const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (user) => ({
                url: "/user/register",
                method: "POST",
                body: user,
            }),
            invalidatesTags: "User",
        }),
    }),
})

export const { useRegisterUserMutation } = userApiSlice

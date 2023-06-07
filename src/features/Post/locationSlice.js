import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { getProvices, getDistricts, getWards, addPost } from "./locationApi"

const initialState = {
    provinces: null,
    districts: null,
    wards: null,
    address: {
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
    },
    status: "idle",
    error: null,
}

export const getProvicesThunk = createAsyncThunk(
    "location/getProvices",
    async (params, { rejectWithValue }) => {
        try {
            const data = await getProvices()
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getDistrictsThunk = createAsyncThunk(
    "location/getDistricts",
    async (provinceId, { rejectWithValue }) => {
        try {
            const data = await getDistricts(provinceId)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getWardsThunk = createAsyncThunk(
    "location/getWards",
    async (districtId, { rejectWithValue }) => {
        try {
            const data = await getWards(districtId)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addPostThunk = createAsyncThunk(
    "location/addPost",
    async (newPost, { rejectWithValue }) => {
        try {
            const data = await addPost(newPost)
            return data
        } catch (error) {
            return rejectWithValue({
                code: error.code,
                message: error.response.data.message,
                statusCode: error.response.status,
                statusText: error.response.statusText,
            })
        }
    }
)

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        updateAddress: (state, action) => {
            state.address.province = action.payload.province
            state.address.district = action.payload.district
            state.address.ward = action.payload.ward
            state.address.detailAddress = action.payload.detailAddress
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProvicesThunk.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getProvicesThunk.fulfilled, (state, action) => {
                state.status = "succeeded"

                const provinces = action.payload

                const newProvinces = provinces.map((province) => {
                    if (province.province_name.startsWith("Tỉnh")) {
                        const newProvince_name = province.province_name
                            .split(" ")
                            .slice(1)
                            .join(" ")
                        return { ...province, province_name: newProvince_name }
                    } else {
                        const newProvince_name = "Tp ".concat(
                            " ",
                            province["province_name"]
                                .split(" ")
                                .slice(2)
                                .join(" ")
                        )
                        return { ...province, province_name: newProvince_name }
                    }
                })

                const sortProvinces = newProvinces.sort((a, b) =>
                    a.province_name.localeCompare(b.province_name)
                )
                state.provinces = sortProvinces
            })
            .addCase(getProvicesThunk.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(getDistrictsThunk.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getDistrictsThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.districts = action.payload
            })
            .addCase(getDistrictsThunk.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(getWardsThunk.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getWardsThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.wards = action.payload
            })
            .addCase(getWardsThunk.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
    },
})

export const selectAllProvinces = (state) => state.location.provinces
export const selectAllDistricts = (state) => {
    return state.location.districts
}
export const selectAllWards = (state) => state.location.wards
export const selectAddress = (state) => state.location.address
export const selectLocationError = (state) => state.location.error

export const { updateAddress } = locationSlice.actions

export default locationSlice.reducer

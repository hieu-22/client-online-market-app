import React from "react"
import {
    getProvicesThunk,
    getDistrictsThunk,
    getWardsThunk,
    selectAllProvinces,
    selectAllDistricts,
    selectAllWards,
    updateAddress,
    selectAddress,
} from "./locationSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useEffect } from "react"

const AddressForm = ({ showAddressForm }) => {
    const dispatch = useDispatch()

    const address = useSelector(selectAddress)

    const [hasRendered, setHasRendered] = useState(false)
    const [province, setProvince] = useState(
        address?.province ? address.province : ""
    )
    const [showProvincesList, setShowProvincesList] = useState(false)
    const [searchProvinceTerm, setSearchProvinceTerm] = useState("")
    const [provinceEmpty, setProvinceEmpty] = useState(false)

    const [district, setDistrict] = useState(
        address?.district ? address.district : ""
    )
    const [showDistrictsList, setShowDistrictsList] = useState(false)
    const [searchDistrictTermm, setSerachDistrictTerm] = useState("")
    const [districtEmpty, setDistrictEmpty] = useState(false)

    const [ward, setWard] = useState(address?.ward ? address.ward : "")
    const [showWardsList, setShowWardsList] = useState(false)
    const [searchWardTerm, setSearchWardTerm] = useState("")
    const [wardEmpty, setWardEmpty] = useState(false)

    const [detailAddress, setDetailAddress] = useState(
        address?.detailAddress ? address.detailAddress : ""
    )
    const [detailAddressEmpty, setDetailAddressEmpty] = useState(false)

    const provinces = useSelector((state) => selectAllProvinces(state))
    const provinceId = provinces
        ? provinces?.find((p) => p.province_name == province)?.province_id
        : undefined

    const districts = useSelector((state) => selectAllDistricts(state))
    const wards = useSelector(selectAllWards)
    const districtId = districts
        ? districts?.find((p) => p.district_name == district)?.district_id
        : undefined

    useEffect(() => {
        if (hasRendered) {
            setDistrict("")
            setWard("")
        } else {
            setHasRendered(true)
        }
    }, [province])

    useEffect(() => {
        if (hasRendered) {
            setWard("")
        } else {
            setHasRendered(true)
        }
    }, [district])

    // use useEffect to handle non-target event
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                // console.log("===> Enter key pressed at AddressForm component")
                handleCompleteAddress()
            }
        }

        // Attach the "keydown" event listener to the window object
        window.addEventListener("keydown", handleKeyDown)

        // CLEARN UP FUNCTION TO Remove the "keydown" event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const handleCompleteAddress = () => {
        if (!province) {
            setProvinceEmpty(true)
        }
        if (!district) {
            setDistrictEmpty(true)
        }
        if (!ward) {
            setWardEmpty(true)
        }
        if (!detailAddress) {
            setDetailAddressEmpty(true)
        }

        if (!(province && district && ward && detailAddress)) return

        dispatch(updateAddress({ province, district, ward, detailAddress }))

        showAddressForm(false)
    }

    const handleGetProvinces = async () => {
        if (provinces) return
        try {
            dispatch(getProvicesThunk())
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetDistricts = async (provinceId) => {
        try {
            dispatch(getDistrictsThunk(provinceId))
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetWards = async (districtId) => {
        try {
            dispatch(getWardsThunk(districtId))
        } catch (error) {
            console.log(error)
        }
    }

    const ProvinceField = (
        <div className="relative text-sm">
            <input
                type="text"
                className={
                    "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary  select-none outline-none placeholder-transparent rounded-sm text-sm "
                }
                id="province"
                value={province}
                onChange={(event) => {
                    setProvince(event.target.value)
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    handleGetProvinces()
                    setShowDistrictsList(false)
                    setShowWardsList(false)
                    setShowProvincesList(true)
                    setProvinceEmpty(false)
                }}
                onInput={(event) => {
                    setSearchProvinceTerm(event.target.value)
                }}
                autoComplete="off"
            />
            <label
                htmlFor="province"
                className={
                    `absolute text-gray-400 ` +
                    (province
                        ? `top-[-2px] left-2 text-gray-600 text-2xs font-medium`
                        : `left-3 top-3`) +
                    ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                }
            >
                Tỉnh, thành phố <span className="text-red-500 px-[2px]">*</span>
            </label>
            {provinceEmpty ? (
                <div className="text-red-500 mt-1">
                    Bạn chưa điền tỉnh, thành phố
                </div>
            ) : (
                <></>
            )}
            <ul
                className={
                    ` absolute top-12 z-50 hidden bg-white w-full shadow-big rounded-lg max-h-[300px] overflow-y-scroll ` +
                    (showProvincesList ? "!block" : "")
                }
            >
                {provinces && !searchProvinceTerm
                    ? provinces.map((province, index) => {
                          return (
                              <li
                                  className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                  key={index}
                                  onClick={(event) => {
                                      setProvince(province.province_name)
                                      setShowProvincesList(false)
                                  }}
                              >
                                  {province.province_name}
                              </li>
                          )
                      })
                    : provinces
                          ?.filter((province) =>
                              province.province_name
                                  .toLowerCase()
                                  .includes(searchProvinceTerm.toLowerCase())
                          )
                          .map((province, index) => {
                              const matchTerm = new RegExp(
                                  searchProvinceTerm,
                                  "gi"
                              )
                              const provinceName =
                                  province.province_name.replace(
                                      matchTerm,
                                      (match) => `<strong>${match}</strong>`
                                  )
                              return (
                                  <li
                                      className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                      key={index}
                                      onClick={(event) => {
                                          setProvince(province.province_name)
                                          setShowProvincesList(false)
                                      }}
                                      dangerouslySetInnerHTML={{
                                          __html: provinceName,
                                      }}
                                  ></li>
                              )
                          })}
            </ul>
        </div>
    )

    const DistrictField = (
        <div className="relative text-sm">
            <input
                type="text"
                className={
                    "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary  select-none outline-none placeholder-transparent rounded-sm text-sm "
                }
                id="district"
                value={district}
                onChange={(event) => {
                    setDistrict(event.target.value)
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    handleGetDistricts(provinceId)
                    setShowProvincesList(false)
                    setShowWardsList(false)
                    setShowDistrictsList(true)
                    setDistrictEmpty(false)
                }}
                onInput={(event) => {
                    setSerachDistrictTerm(event.target.value)
                }}
                autoComplete="off"
            />
            <label
                htmlFor="district"
                className={
                    `absolute text-gray-400 ` +
                    (district
                        ? `top-[-2px] left-2 text-gray-600 text-2xs font-medium`
                        : `left-3 top-3`) +
                    ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                }
            >
                Quận, huyện, thị xã{" "}
                <span className="text-red-500 px-[2px]">*</span>
            </label>
            {districtEmpty ? (
                <div className="text-red-500 mt-1">
                    Bạn chưa điền quận, huyện, thị xã
                </div>
            ) : (
                <></>
            )}
            <ul
                className={
                    ` absolute top-12 z-50 hidden bg-white w-full shadow-big rounded-lg max-h-[300px] overflow-y-scroll ` +
                    (showDistrictsList ? "!block" : "")
                }
            >
                {districts && !searchDistrictTermm
                    ? districts.map((district, index) => {
                          return (
                              <li
                                  className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                  key={index}
                                  onClick={(event) => {
                                      event.stopPropagation()
                                      setDistrict(district.district_name)
                                      setShowDistrictsList(false)
                                  }}
                              >
                                  {district.district_name}
                              </li>
                          )
                      })
                    : districts
                          ?.filter((district) =>
                              district.district_name
                                  .toLowerCase()
                                  .includes(searchDistrictTermm.toLowerCase())
                          )
                          .map((district, index) => {
                              const matchTerm = new RegExp(
                                  searchDistrictTermm,
                                  "gi"
                              )
                              const districtName =
                                  district.district_name.replace(
                                      matchTerm,
                                      (match) => `<strong>${match}</strong>`
                                  )
                              return (
                                  <li
                                      className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                      key={index}
                                      onClick={(event) => {
                                          event.stopPropagation()
                                          setDistrict(district.district_name)
                                          setShowDistrictsList(false)
                                      }}
                                      dangerouslySetInnerHTML={{
                                          __html: districtName,
                                      }}
                                  ></li>
                              )
                          })}
            </ul>
        </div>
    )

    const WardField = (
        <div className="relative text-sm">
            <input
                type="text"
                className={
                    "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary  select-none outline-none placeholder-transparent rounded-sm text-sm "
                }
                id="ward"
                value={ward}
                onChange={(event) => {
                    setWard(event.target.value)
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    handleGetWards(districtId)
                    setShowProvincesList(false)
                    setShowDistrictsList(false)
                    setShowWardsList(true)
                    setWardEmpty(false)
                }}
                onInput={(event) => {
                    setSearchWardTerm(event.target.value)
                }}
                autoComplete="off"
            />
            <label
                htmlFor="ward"
                className={
                    `absolute text-gray-400 ` +
                    (ward
                        ? `top-[-2px] left-2 text-gray-600 text-2xs font-medium`
                        : `left-3 top-3`) +
                    ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                }
            >
                Phường, xã, thị trấn{" "}
                <span className="text-red-500 px-[2px]">*</span>
            </label>
            {wardEmpty ? (
                <div className="text-red-500 mt-1">
                    Bạn chưa điền phường, xã, thị trấn
                </div>
            ) : (
                <></>
            )}
            <ul
                className={
                    ` absolute top-12 z-50 hidden bg-white w-full shadow-big rounded-lg max-h-[300px] overflow-y-scroll ` +
                    (showWardsList ? "!block" : "")
                }
            >
                {wards && !searchWardTerm
                    ? wards.map((ward, index) => {
                          return (
                              <li
                                  className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                  onClick={(event) => {
                                      event.stopPropagation()
                                      setWard(ward.ward_name)
                                      setShowWardsList(false)
                                  }}
                                  key={index}
                              >
                                  {ward.ward_name}
                              </li>
                          )
                      })
                    : wards
                          ?.filter((wards) =>
                              wards.ward_name
                                  .toLowerCase()
                                  .includes(searchWardTerm.toLowerCase())
                          )
                          .map((ward, index) => {
                              const matchTerm = new RegExp(searchWardTerm, "gi")
                              const wardName = ward.ward_name?.replace(
                                  matchTerm,
                                  (match) => `<strong>${match}</strong>`
                              )
                              return (
                                  <li
                                      className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                      key={index}
                                      onClick={(event) => {
                                          event.stopPropagation()
                                          setWard(ward.ward_name)
                                          setShowWardsList(false)
                                      }}
                                      dangerouslySetInnerHTML={{
                                          __html: wardName,
                                      }}
                                  ></li>
                              )
                          })}
            </ul>
        </div>
    )

    const DetailAddressField = (
        <div className="relative text-sm">
            <input
                type="text"
                className={
                    "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary  select-none outline-none placeholder-transparent rounded-sm text-sm "
                }
                id="detailAddress"
                value={detailAddress}
                onChange={(event) => {
                    setDetailAddress(event.target.value)
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    setDetailAddressEmpty(false)
                }}
            />
            <label
                htmlFor="detailAddress"
                className={
                    `absolute text-gray-400 ` +
                    (detailAddress
                        ? `top-[-2px] left-2 text-gray-600 text-2xs font-medium`
                        : `left-3 top-3`) +
                    ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                }
            >
                Địa chỉ cụ thể <span className="text-red-500 px-[2px]">*</span>
            </label>
            {detailAddressEmpty ? (
                <div className="text-red-500 mt-1">
                    Bạn chưa điền địa chỉ cụ thể
                </div>
            ) : (
                <></>
            )}
        </div>
    )

    return (
        <div
            className={
                "fixed z-[99] w-[500px] py-6 px-6 bg-white translate-y-[35%] rounded-md shadow-big"
            }
            onClick={(event) => {
                event.stopPropagation()
                setShowProvincesList(false)
                setShowDistrictsList(false)
            }}
            onKeyDown={(event) => {
                console.log("==> Event at", event.target)
                if (event.key === "Enter") {
                    handleCompleteAddress()
                }
            }}
        >
            <h2 className="font-semibold text-center">Địa chỉ</h2>
            <div className="mt-6">{ProvinceField}</div>
            <div className="mt-6">{DistrictField}</div>
            <div className="mt-6">{WardField}</div>
            <div className="mt-6">{DetailAddressField}</div>
            <div className="mt-6">
                <button
                    className=" block py-2 w-full bg-primary text-white rounded-md hover:bg-light-primary"
                    onClick={handleCompleteAddress}
                >
                    XONG
                </button>
            </div>
        </div>
    )
}

export default AddressForm

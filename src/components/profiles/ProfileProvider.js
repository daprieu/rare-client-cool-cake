import React, { useState } from "react"

export const ProfileContext = React.createContext()

export const ProfileProvider = (props) => {
    const [profile, setProfile] = useState({ events: [] })
    const [allProfiles, setAllProfiles] = useState([])

    const getProfile = userId => {
        return fetch(`http://localhost:8000/profiles/${userId}`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("rare_user_id")}`
            }
        })
            .then(response => response.json())
            .then(setProfile)
    }
    const getAllProfiles = () => {
        return fetch("http://localhost:8000/profiles", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("rare_user_id")}`
            }
        })
            .then(response => response.json())
            .then(response => {

                if (response.includes("admin") && response.includes("false")) {
                    setAllProfiles([])
                } else {
                    setAllProfiles(response)
                }
            })
    }

    const deactivateProfile = userId => {
        return fetch(`http://localhost:8000/profiles/${userId}/deactivate`, {
            method: "PUT",
            headers: {
                "Authorization": `Token ${localStorage.getItem("rare_user_id")}`
            }
        })
            .then(getAllProfiles)
    }
    // deactivate TODO:
        // update profile serializer to return active status
        // update profile serializer so inactive profiles are only returned to admin
        // add conditional button on profile list to deactive user
            // add confirmation on action


    return (
        <ProfileContext.Provider value={{
            profile, getProfile, allProfiles, getAllProfiles, deactivateProfile
        }}>
            {props.children}
        </ProfileContext.Provider>
    )
}

import { constants } from "../../03-constants/Constants";

export const getUser = (idToken) =>  fetch(constants.apiIP + "userProfile/getUserProfile", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        "Authorization": "Bearer " + idToken
    },
})

export const createUserProfile = (currentToken, data) => fetch(constants.apiIP + "userProfile/create", {
    method: 'post',
    body: data,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + currentToken
    },
})

export const checkEmailVerification = (myEmail) => fetch(constants.apiIP + "signUp/check", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: myEmail
    })
})

export const UpdateUserProfile = (currentToken, data) => fetch(constants.apiIP + "userProfile/updateUserProfile", {
    method: 'post',
    body: data,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + currentToken
    },
})
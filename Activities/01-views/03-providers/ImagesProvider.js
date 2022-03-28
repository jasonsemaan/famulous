import { constants } from "../../03-constants/Constants";

export const StoreImage = (currentToken,data) => fetch(constants.apiIP + "journal/storeImage", {
    method: 'post',
    body: data,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + currentToken
    },
})

export const EditionImagesCall = (token, editionRef) => fetch(constants.apiIP + "journal/selectEditionImages", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
        editionRef: editionRef
    })
})

export const DeleteImage = (imageRef) => fetch(constants.apiIP + "journal/deleteImage", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        imgStoreRef: imageRef,
    })
})

export const GetSingleEditionImages = (idToken, editionRef) => fetch(constants.apiIP + "journal/selectSingleEditionImages", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + idToken
    },
    body: JSON.stringify({
        editionRef: editionRef
    })
})

export const UpdateCoverImage = (idToken, data) => fetch(constants.apiIP + "journal/insertUpdateCoverPicture", {
    method: 'post',
    body: data,
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + idToken
    },
  })
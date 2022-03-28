import { constants } from "../../03-constants/Constants";

export const CreateEvent = (currentToken, editionRef, selectedDate, eventDescription) =>   fetch(constants.apiIP + "journal/createEvent", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + currentToken
    },
    body: JSON.stringify({
        editionRef: editionRef,
        eventDate: selectedDate,
        eventDescription: eventDescription
    })
})

export const GetEditionEvents = (editionRef) => fetch(constants.apiIP + "journal/getEditionEvents", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        editionRef: editionRef,
    })
})

export const DeleteEvent = (eventRef) => fetch(constants.apiIP + "journal/deleteEditionEvent", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        eventRef: eventRef,
    })
})
import { constants } from "../../03-constants/Constants";

export const UserJournals = (idToken) => fetch(constants.apiIP + "journal/getAllJournals", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + idToken
    },
    body: JSON.stringify({
        name: ""
    })
})

export const CreateJournal = (currentToken, journalName) => fetch(constants.apiIP + "journal/create", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + currentToken
    },
    body: JSON.stringify({
        name: journalName
    })
})

export const UserInvitedJournals = (currentToken) => fetch(constants.apiIP + "journal/getInvitedJournalsByUserUid", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        "Authorization": "Bearer " + currentToken
    },
})

export const JournalEditionsCall = (idToken, journalName) => fetch(constants.apiIP + "journal/getJournalEditions", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + idToken
    },
    body: JSON.stringify({
        name: journalName
    })
})

export const InvitedJournalEditionsCall = (ownerUID, journalName) => fetch(constants.apiIP + "journal/getJournalEditionsToInvitedJournal", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userUid: ownerUID,
        journalName: journalName
    })
})

export const JournalContributorsCall = (journalRef) => fetch(constants.apiIP + "journal/getAllJournalContributors", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        journalRef: journalRef,
    })
})

export const GeneratePDF = (currentToken, editionREF, journalNAME, currentLanguage) => fetch(constants.apiIP + "pdfGenerator/generate", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + currentToken
    },
    body: JSON.stringify({
        editionRef: editionREF,
        journalName: journalNAME,
        lang: currentLanguage
    })
})

export const UpdateSharedKey = (currentToken, sharedKey) => fetch(constants.apiIP + "journal/updateSharedKeyAfterJoin", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + currentToken
    },
    body: JSON.stringify({
        pinCode: sharedKey
    })
})

export const GetKey = () => fetch(constants.apiIP + "journal/generateKey", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
})

export const InsertAdminSharedkey = (idToken, journalRef, key) => fetch(constants.apiIP + "journal/insertAdminSharedKey", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + idToken
    },
    body: JSON.stringify({
        journalRef: journalRef,
        pinCode: key
    })
})

export const DeleteJournal = (journalRef) => fetch(constants.apiIP + "journal/deleteJournal", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      journalRef: journalRef,
    })
  })

  export const UpdateJournalName = (journalRef,currentJournalName) => fetch(constants.apiIP + "journal/updateJournalName", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      journalRef: journalRef,
      journalName: currentJournalName
    })
  })

  export const GetAllJournalContributors = (journalRef) => fetch(constants.apiIP + "journal/getAllJournalContributors", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        journalRef: journalRef,
    })
})

export const RemoveContributorFromInvites = (journalRef, contributorUid) => fetch(constants.apiIP + "journal/removeContributorFromInvites", {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        journalRef: journalRef,
        contributorUid: contributorUid
    })
})
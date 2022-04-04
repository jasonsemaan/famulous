import React, { createContext, useReducer, useContext } from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_EDITION_REF':
            return {
                ...state,
                EditionRef: action.payload
            };
        case 'ACCESS_STATUS':
            return {
                ...state,
                accessStatus: action.payload
            };
        case 'APP_LANGUAGE':
            return {
                ...state,
                appLanguage: action.payload
            };
        case 'USER_UID':
            return {
                ...state,
                UserUid: action.payload
            };
        case 'JOURNAL_NAME':
            return {
                ...state,
                JournalName: action.payload
            };
        case 'JOURNAL_REF':
            return {
                ...state,
                JournalRef: action.payload
            };
        case 'ADMIN':
            return {
                ...state,
                Admin: action.payload
            };
        case 'EDITION_RELEASE_DATE':
            return {
                ...state,
                EditionReleaseDate: action.payload
            };
        case 'COVER_IMAGE':
            return {
                ...state,
                CoverImage: action.payload
            };
        case 'PREVIEW_STATUS':
            return {
                ...state,
                previewStatus: action.payload
            };
        case 'EDITION_DAYS_LEFT':
            return {
                ...state,
                editionDaysLeft: action.payload
            };
        case 'DATE_MONTH':
            return {
                ...state,
                DateMonth: action.payload
            };
        case 'TOKEN_ID':
            return {
                ...state,
                Token: action.payload
            };

        default:
            return state;
    }
}

export const JournalContext = createContext({});

export const JournalProvider = ({ children }) => {
    const initialState = {
        EditionRef: null,
        accessStatus: null,
        appLanguage: null,
        UserUid: null,
        JournalName: null,
        JournalRef: null,
        Admin: null,
        EditionReleaseDate: null,
        CoverImage: null,
        previewStatus: null,
        editionDaysLeft: null,
        DateMonth: null,
        Token: null,
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <JournalContext.Provider value={{
            ...state,
            setEditionRef: (EditionRef) => dispatch({ type: 'SET_EDITION_REF', payload: EditionRef }),
            setAccessStatus: (accessStatus) => dispatch({ type: 'ACCESS_STATUS', payload: accessStatus }),
            setAppLanguage: (appLanguage) => dispatch({ type: 'APP_LANGUAGE', payload: appLanguage }),
            setUserUid: (UserUid) => dispatch({ type: 'USER_UID', payload: UserUid }),
            setJournalName: (JournalName) => dispatch({ type: 'JOURNAL_NAME', payload: JournalName }),
            setJournalRef: (JournalRef) => dispatch({ type: 'JOURNAL_REF', payload: JournalRef }),
            setAdmin: (Admin) => dispatch({ type: 'ADMIN', payload: Admin }),
            setEditionReleaseDate: (EditionReleaseDate) => dispatch({ type: 'EDITION_RELEASE_DATE', payload: EditionReleaseDate }),
            setCoverImage: (CoverImage) => dispatch({ type: 'COVER_IMAGE', payload: CoverImage }),
            setPreviewStatus: (previewStatus) => dispatch({ type: 'PREVIEW_STATUS', payload: previewStatus }),
            setEditionDaysLeft: (editionDaysLeft) => dispatch({ type: 'EDITION_DAYS_LEFT', payload: editionDaysLeft }),
            setDateMonth: (DateMonth) => dispatch({ type: 'DATE_MONTH', payload: DateMonth }),
            setToken: (Token) => dispatch({ type: 'TOKEN_ID', payload: Token }),

        }}>
            {children}
        </JournalContext.Provider>
    )
}
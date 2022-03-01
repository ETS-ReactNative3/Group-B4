import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Box,
    Typography,
} from '@mui/material'
import ChipFilter from '../components/ChipFilter'
import { useCookies } from 'react-cookie'
import logo from '../assets/bearLogo.png'

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
    },
    title: {
        paddingRight: 2,
        fontFamily: 'Work Sans',
        fontSize: 40,
        marginBottom: 3,
        fontWeight: 'bold',
    },
    logoContainer: {
        padding: 2,
        display: 'flex',
        flexDirection: 'row',
        width: 300,
    },
    formContainer: {
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 0px 4px rgba(0, 0, 0, 0.3)',
        borderRadius: 4,
    },
    formColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
}

export default function Profile() {
    let user = JSON.parse(localStorage.getItem('user'))
    const [schoolYear, setSchoolYear] = useState(user.year)
    const [pronouns, setPronouns] = useState(user.pronouns)
    // eslint-disable-next-line
    const [signupError, setSignupError] = useState(false)

    //selected tags
    const [selectedClassTags, setSelectedClassTags] = useState([])
    const [selectedAffiliationTags, setSelectedAffiliationTags] = useState([])
    const [selectedInterestTags, setSelectedInterestTags] = useState([])

    //available tag options
    const [classesTagOptions, setClassesTagOptions] = useState([])
    const [interestsTagOptions, setInterestsTagOptions] = useState([])
    const [affiliationsTagOptions, setAffiliationsTagOptions] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        setClassesTagOptions(['CS 31', 'MATH 32A', 'PHYSICS 1A', 'BIO 1'])
        setInterestsTagOptions(['Biking', 'Skating', 'Dancing'])
        setAffiliationsTagOptions(['Theta Chi', 'DevX', 'GlobeMed', 'Climbing Club'])
    }, [])

    // eslint-disable-next-line
    const [cookies, setCookie] = useCookies(['jwt'])

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const name = event.target.elements.name.value
        const schoolYear = event.target[2].value
        const major = event.target.elements.major.value
        const email = user.username
        const hometown = event.target.elements.hometown.value
        const pronouns = event.target[14].value
        const bio = event.target.bio.value
        const data = {
            name: name,
            username: email.toLowerCase(),
            year: schoolYear,
            major,
            hometown,
            pronouns,
            bio,
            classes: selectedClassTags,
            interests: selectedInterestTags,
            affiliations: selectedAffiliationTags,
        }
        let requestObj = {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: document.cookie,
            },
            body: JSON.stringify(data),
        }
        // setCookie('jwt', requestObj.jwt, { path: '/' })
        const response = await fetch('/api/user/updateUserInfo', requestObj)
        if (response.status === 200) {
            //successful login
            //let responseObj = await response.json()
            //setCookie('jwt', responseObj.jwt, { path: '/' })
            //localStorage.setItem('user', JSON.stringify(responseObj.user))
            // eslint-disable-next-line
            //const cookies = document.cookie
            user.name = data.name
            user.year = data.year
            user.major = data.major
            user.hometown = data.hometown
            user.pronouns = data.pronouns
            user.bio = data.bio
            user.insta = data.insta
            user.facebook = data.facebook
            user.twitter = data.twitter
            user.linkedIn = data.linkedIn
            user.classes = data.classes
            user.interests = data.interests
            user.affiliations = data.affiliations
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/Explore')
        } else if (response.status === 400) {
            console.log('bad response')
        }
    }

    return (
        <Box sx={styles.root}>
            <Box sx={styles.rowContainer}>
                <Box sx={styles.logoContainer}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <Typography sx={styles.title}>Profile</Typography>
                </Box>
            </Box>
            <form onSubmit={handleFormSubmit}>
                <Box sx={styles.formContainer}>
                    <Box sx={styles.formColumn}>
                        <TextField
                            required
                            label="Full Name"
                            id="name"
                            defaultValue={user.name}
                            style={{ padding: '5px' }}
                        />
                        <FormControl style={{ padding: '5px' }}>
                            <InputLabel>School Year</InputLabel>
                            <Select
                                required
                                value={schoolYear}
                                onChange={(e, item) => {
                                    setSchoolYear(item.props.value)
                                }}
                            >
                                <MenuItem value={'Freshman'}>Freshman</MenuItem>
                                <MenuItem value={'Sophmore'}>Sophmore</MenuItem>
                                <MenuItem value={'Junior'}>Junior</MenuItem>
                                <MenuItem value={'Senior'}>Senior</MenuItem>
                                <MenuItem value={'Senior+'}>Senior+</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            required
                            label="Major"
                            id="major"
                            defaultValue={user.major}
                            style={{ padding: '5px' }}
                        />
                        <TextField
                            disabled
                            label="Email"
                            id="email"
                            defaultValue={user.username}
                            style={{ padding: '5px' }}
                        />
                    </Box>
                    <Box sx={styles.formColumn}>
                        <TextField
                            label="Hometown"
                            defaultValue={user.hometown}
                            style={{ padding: '10px' }}
                            id="hometown"
                        />
                        <FormControl style={{ padding: '10px' }}>
                            <InputLabel>Pronouns</InputLabel>
                            <Select
                                value={pronouns}
                                onChange={(e, item) => setPronouns(item.props.value)}
                                label="Pronouns"
                            >
                                <MenuItem value={'he'}>He/Him/His</MenuItem>
                                <MenuItem value={'she'}>She/Her/Hers</MenuItem>
                                <MenuItem value={'they'}>They/Them/Theirs</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="bio"
                            style={{ padding: '10px' }}
                            placeholder="Tell us a little about yourself!"
                            multiline
                            rows={5}
                            maxRows={5}
                            defaultValue={user.bio}
                        />
                    </Box>
                    <Box sx={styles.formColumn}>
                        <ChipFilter
                            setTagOptions={setClassesTagOptions}
                            type="Classes"
                            tagOptions={classesTagOptions}
                            defaultShownTags={user.classes}
                            setSelectedTags={setSelectedClassTags}
                            selectedTags={selectedClassTags}
                        />
                        <ChipFilter
                            setTagOptions={setInterestsTagOptions}
                            type="Interests"
                            tagOptions={interestsTagOptions}
                            defaultShownTags={user.interests}
                            setSelectedTags={setSelectedInterestTags}
                            selectedTags={selectedInterestTags}
                        />
                        <ChipFilter
                            setTagOptions={setAffiliationsTagOptions}
                            type="Affiliations"
                            tagOptions={affiliationsTagOptions}
                            defaultShownTags={user.affiliations}
                            setSelectedTags={setSelectedAffiliationTags}
                            selectedTags={selectedAffiliationTags}
                        />
                    </Box>
                </Box>
                <Button fullWidth variant="contained" color="success" type="submit">
                    Update Info
                </Button>
            </form>
        </Box>
    )
}

import * as React from 'react';
import {useContext, useState} from 'react';
import styled from "styled-components";

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled as muiStyled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';


import {UserContext} from "../../utils/context";
import {ApiProfile} from "../../global/global";

const Wrapper = styled.div`
	margin-top: 64px
`

interface ChipData {
  key: number;
  label: string;
}

const ListItem = muiStyled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

// common cancel event
const handleCancel = (
	info: any,
	defaultValue: string,
	setE: Function
) => {
	// if (!info[info.index].value)
	// 	return
	setE((prev: any) => {
		prev[info.index].value = defaultValue
		prev[info.index].stat = null

		return [...prev]
	})
}

// common valid event
const handleValid = async (
	event: React.FormEvent<HTMLFormElement>,
	info: any,
	defaultValue: string,
	setU: Function,
	setE: Function
) => {
		// update request
	const updateValue =  async (data: any) => {
		const token = localStorage.getItem('__access_token__')
		if (!token) return false

		const url = `${ApiProfile}/profile`
		const res = await fetch(url, {
			method: 'post',
			body: JSON.stringify(data),
			headers: {
				authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})

		return res.status === 200
	}

	const data = new FormData(event.currentTarget)
	const dataToUpdate: any = {}

	dataToUpdate[info.key] = data.get(info.key)
	if (dataToUpdate[info.key] !== defaultValue && await updateValue(dataToUpdate)) {
		setU((prev: any) => {
			prev[info.key] = dataToUpdate[info.key]
			return {...prev}
		})
		setE((prev: any) => {
			prev[info.index].value = dataToUpdate[info.key]
			prev[info.index].stat = null

			return [...prev]
		})
	}
	else handleCancel(info, defaultValue, setE)
}

// text component
const TextCommonEditable = (props: {
	info: any,
	defaultValue: string,
	setE: React.Dispatch<any>,
	setU: React.Dispatch<any>,
}) => {
	const { info, defaultValue, setE, setU } = props

	return (
		<Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			handleValid(event, info, defaultValue, setE, setU).then()
		}}>
			<TextField
				required
				size='small'
				fullWidth
				id={info.key}
				name={info.key}
				defaultValue={defaultValue}
				variant="standard"
			/>
			<Button type="submit" color="success">Valid</Button>
			<Button color="error" onClick={() => {
				handleCancel(info, defaultValue, setE)
			}}>Cancel</Button>
		</Box>
	)
}

// text area component
const TextAreaCommonEditable = (props: {
	info: any,
	defaultValue: string,
	setE: React.Dispatch<any>,
	setU: React.Dispatch<any>,
}) => {
	const { info, defaultValue, setE, setU } = props

	return (
		<Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			handleValid(event, info, defaultValue, setE, setU).then()
		}}>
			<TextareaAutosize
				required
				maxRows={3}
				id={info.key}
				name={info.key}
				defaultValue={defaultValue === null ? '' : defaultValue}
				placeholder={'Enter your bio'}
				style={{ width: '100%', height: '50px' }}
			/>
			<div>
				<Button type="submit" color="success">Valid</Button>
				<Button color="error" onClick={() => {
					handleCancel(info, defaultValue, setE)
				}}>Cancel</Button>
			</div>
		</Box>
	)
}

// radio component
const RatioCommonEditable = (props: {
	info: any,
	defaultValue: string,
	setE: React.Dispatch<any>,
	setU: React.Dispatch<any>,
}) => {
	const { info, defaultValue, setE, setU } = props

	return (
    <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			handleValid(event, info, defaultValue, setE, setU).then()
		}}>
      <RadioGroup
				id={info.key}
				name={info.key}
        defaultValue={defaultValue === null ? 'other' : defaultValue}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
				<Button type="submit" color="success">Valid</Button>
				<Button color="error" onClick={() => {
					handleCancel(info, defaultValue, setE)
				}}>Cancel</Button>
    </Box>
  );
}

// hashtag component
const MatchaTags = () => {
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chipData.map((data) => {
        let icon;

        return (
          <ListItem key={data.key}>
            <Chip
              icon={icon}
              label={data.label}
              onDelete={handleDelete(data)}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}

// main component
const CustomizedTimeline = () => {
  const { user, setUser } = useContext(UserContext)
	const [infoEditable, setInfoEditable] = useState<Array<any>>([
		{
			key: 'fname',
			keyRender: 'First name',
			value: user['fname'],
			stat: null,
			index: 0
		},
		{
			key: 'name',
			keyRender: 'Name',
			value: user['name'],
			stat: null,
			index: 1
		},
		{
			key: 'birthday',
			keyRender: 'Birthday',
			value: user['birthday'],
			stat: null,
			index: 2
		},
		{
			key: 'sex',
			keyRender: 'Sex',
			value: user['sex'],
			stat: null,
			index: 3
		},
		{
			key: 'bio',
			keyRender: 'Bio',
			value: user['bio'],
			stat: null,
			index: 4
		},
		{
			key: 'sex_o',
			keyRender: 'Sex orientation',
			value: user['sex_o'],
			stat: null,
			index: 5
		},
		{
			key: 'tag_l',
			keyRender: 'Tags',
			value: user['tag_l'],
			stat: null,
			index: 6
		},
	])

	const infoListEditable = {
		fname: (<TextCommonEditable
			info={infoEditable[0]}
			defaultValue={infoEditable[0].value}
			setE={setInfoEditable}
			setU={setUser}
		/>),
		name: (<TextCommonEditable
			info={infoEditable[1]}
			defaultValue={infoEditable[1].value}
			setE={setInfoEditable}
			setU={setUser}
		/>),
		birthday: user['birthday'],
		sex: (<RatioCommonEditable
			info={infoEditable[3]}
			defaultValue={infoEditable[3].value}
			setE={setInfoEditable}
			setU={setUser}
		/>),
		bio: (<TextAreaCommonEditable
			info={infoEditable[4]}
			defaultValue={infoEditable[4].value}
			setE={setInfoEditable}
			setU={setUser}
		/>),
		sex_o: (<RatioCommonEditable
			info={infoEditable[5]}
			defaultValue={infoEditable[5].value}
			setE={setInfoEditable}
			setU={setUser}
		/>),
		tag_l: (<MatchaTags />)
	}

	const EditEvent = (editable: any, setE: React.Dispatch<any>, info: any) => {
		if (info.stat === 'editing') return

		setE((prev: any) => {
			prev[info.index].value = editable[info.key]
			prev[info.index].stat = 'editing'

			return [...prev]
		})
	}

	return (
    <Timeline>
      {infoEditable.map((info: any, idx) => {
				return (
          <TimelineItem key={info.key}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="#9fa8a3"
            >
							{info.keyRender}
            </TimelineOppositeContent>
            <TimelineSeparator>
							<TimelineDot
								sx={{
									cursor: 'pointer',
									'&:hover': {opacity: '0.8'},
									'&:active': {bgcolor: '#9fa8a3'}
								}}
								onClick={() => {
									EditEvent(infoListEditable, setInfoEditable, info)
								}}
							>
								<EditIcon />
							</TimelineDot>
							{
								idx !== infoEditable.length - 1
									? <TimelineConnector />
									: ''
							}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '24px', px: 2 }}>
              <Typography variant="h6" component="span" color='#9fa8a3' >
								{
									info.value === null
									? '?'
									: info.value
								}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  );
}

const Profile = () => {
	return (
		<Wrapper>
			<CustomizedTimeline />
		</Wrapper>
	)
}

export default Profile
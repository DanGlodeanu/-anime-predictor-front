export const API_URL = "http://localhost:5000"
export const ADD_USER_TYPES = [
    {
        value: 2,
        label: "Teacher",
    },
    {
        value: 3,
        label: "Student",
    },
];

export const COURSES_DAY_TYPES = [
    {
        value: 0,
        label: "Monday",
    },
	{
        value: 1,
        label: "Tuesday",
    },
	{
        value: 2,
        label: "Wednesday",
    },
	{
        value: 3,
        label: "Thursday",
    },
	{
        value: 4,
        label: "Friday",
    },
];

export const FIVE_MINUTES = 300000 ;

export const QR_TYPES = [
	{
		value: 1,
		label: "Course Start",
	},
	{
		value: 2,
		label: "Course Random",
	},
	{
		value: 3,
		label: "Course End",
	},
];

export const COURSES_INTERVAL_TYPES = [
    {
        value: 0,
        label: "8:00 - 10:00",
    },
	{
        value: 1,
        label: "10:00 - 12:00",
    },
	{
        value: 2,
        label: "12:00 - 14:00",
    },
	{
        value: 3,
        label: "14:00 - 16:00",
    },
	{
        value: 4,
        label: "16:00 - 18:00",
    },
	{
        value: 5,
        label: "18:00 - 20:00",
    },
];

export const SELECT_STYLES = {
	control: provided => ( {
		...provided,
		border: '0.0625rem solid #000000',
		borderRadius: '0rem',
		minHeight: '2rem',
		height: '2rem',
		boxShadow: '0.0625rem solid black',
		cursor: 'pointer',
		backgroundColor: '#141416',
		'&:hover': {
			border: '0.0625rem solid #000000',
			cursor: 'pointer',
		},
	} ),
	valueContainer: provided => ( {
		...provided,
		padding: '0 0.5rem 0 0.6rem',
		fontSize: '0.85rem',
		color: '#f8f9fa',
	} ),
	placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: '#f8f9fa',
        }
    },
	input: provided => ( {
		...provided,
		margin: 0,
		fontSize: '0.75rem',
		width: '100%',
		fontWeight: 400,
		color: '#f8f9fa',
	} ),
	noOptionsMessage: provided => ( {
		...provided,
		fontSize: '0.75rem',
	} ),
	indicatorSeparator: () => ( {
		display: 'none',
	} ),
	indicatorsContainer: provided => ( {
		...provided,
		height: '100%',
		marginRight: '0.5rem',
	} ),
	menu: provided => ( {
		...provided,
        boxShadow: 'none',
		marginTop: '0px',
		borderRadius: '0rem',
		borderWidth: '0px 1px 1px 1px',
        borderStyle: 'solid',
        borderColor: '#000000',
		backgroundColor: '#c9cdb9',
	} ),
	menuPortal: provided => ( {
		...provided,
		zIndex: 9999,
	} ),
	option: provided => ( {
		...provided,
		fontSize: '0.875rem',
		cursor: 'pointer',
		fontWeight: 400,
		color: '#f8f9fa',
		backgroundColor: provided.backgroundColor !== 'transparent' ? '#141416' : provided.backgroundColor,
	} ),
	loadingMessage: provided => ( {
		...provided,
		fontSize: '0.75rem',
	} ),
	singleValue: provided => ( {
		...provided,
		color: '#f8f9fa',
	} ),
	dropdownIndicator: provided => ( {
		...provided,
		color: '#f8f9fa',
		'&:hover': {
			color: '#f8f9fa',
		},
		'& > svg': {
			height: '1.5rem',
			width: '1.5rem',
		},
	} ),
};
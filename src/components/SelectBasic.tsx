import Select from 'react-select'
import { Alert } from 'reactstrap'

const SelectBasic = ({
    className = 'react-select',
    colourOptions = '',
    id = '',
    value = { value: '', label: '' },
    name = 'select',
    changeHandler,
    blurHandler,
    errorMessage = '',
    placeholder = 'Select',
    isDisabled = false,
    isLoading = false,
    isClearable = true,
}) => {
    return (
        <>
            <Select
                className={className}
                classNamePrefix='select'
                defaultValue={{ value: '', label: '' }}
                options={colourOptions}
                isLoading={isLoading}
                name={name}
                value={value}
                onChange={changeHandler(name)}
                onBlur={blurHandler}
                isClearable={isClearable}
                isDisabled={isDisabled}
                invalid={errorMessage ? true : false}
                placeholder={placeholder}
            />         
            {errorMessage && <span className="text-danger">{errorMessage}</span>}
        </>
    )
}

export default SelectBasic

// disabled

import { Input, Label, FormFeedback } from "reactstrap";


const InputBasic = ({
    className = 'form-control',
    type = 'text',
    name = 'name',
    id = 'basicInput',
    disabled = false,
    value = '',
    label = 'name',
    changeHandler,
    blurHandler,
    errorMessage = '',
    required = false,
    placeholder = 'Enter Name',
}) => {


    return (
        <div>
            <Label className='form-label' for={id}>
                {label}
            </Label>
            <Input
                className={className}
                type={type}
                name={name}
                id={id}
                disabled={disabled}
                value={value}
                onChange={changeHandler(name)}
                onBlur={blurHandler}
                required={required}
                placeholder={placeholder}
                invalid={errorMessage ? true : false}
            />
            {errorMessage && <span className="text-danger">{errorMessage}</span>}
        </div>
    )
}
export default InputBasic;
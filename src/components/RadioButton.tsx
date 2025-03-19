// ** Reactstrap Imports
import { Label, Input } from 'reactstrap'

const RadioButton = ({
    name = 'ex1',
    id = 'radio',
    disabled = false,
    type = "radio",
    checked = false,
    changeHandler }) => {
    return (
        <div className='form-check'>
            <Input
                type={type}
                name={name}
                id={id}
                disabled={disabled}
                onChange={(changeHandler(name))}
                checked={checked} />

            <Label className='form-check-label'
                for={id}
            >
                Checked
            </Label>
        </div>

    )
}
export default RadioButton

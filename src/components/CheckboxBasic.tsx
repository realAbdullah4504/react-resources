// ** Reactstrap Imports
import { Label, Input } from "reactstrap";

const CheckboxBasic = ({
    name = 'checkbox',
    id = 'checkbox',
    disabled = false, 
    type = "checkbox", 
    value = false, 
    changeHandler }) => {
    return (
        <div className="demo-inline-spacing">
            <div className="form-check form-check-inline">
                <Input
                    type={type}
                    disabled={disabled}
                    value={value}
                    onChange={changeHandler(name)}
                    name={name}
                    id={id} />
                <Label className="form-check-label">Checked</Label>
            </div>
        </div>
    );
};
export default CheckboxBasic;

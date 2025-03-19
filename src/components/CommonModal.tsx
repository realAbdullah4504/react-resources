// ** React Imports
import { useState } from "react";

// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import ModalFooterBasic from "./ModalFooterBasic";
import InputBasic from "./InputBasic";
import CheckboxBasic from "./CheckboxBasic";
import SwitchBasic from "./SwitchBasic";
import SelectBasic from "./SelectBasic";



const ModalForm = ({ blurHandler, changeHandler, errorMessage, value,
    formSetting }) => {
    // const [formModal, setFormModal] = useState(false);

    const colourOptions = [
        { value: "ocean", label: "Ocean" },
        { value: "blue", label: "Blue" },
        { value: "purple", label: "Purple" },
        { value: "red", label: "Red" },
        { value: "orange", label: "Orange" },
    ];
    return (

        <div>
            <ModalBody>
                {formSetting.map(form => {
                    if (form?.name !== 'select') {
                        return (
                            <div key={form?.id} className="mb-2">
                                <InputBasic
                                    changeHandler={changeHandler}
                                    id={form?.id}
                                    errorMessage={errorMessage[form?.id]}
                                    blurHandler={blurHandler(value[form?.name], form?.name)}
                                    value={value[form?.name]}
                                    name={form?.name}
                                    label={form?.label}
                                    type={form?.type}
                                    // disabled={!form?.isUpdate}
                                    placeholder={form?.placeHolder}
                                />
                            </div>
                        )
                    }
                    else {
                        return (
                            <div key={form?.id} className="mb-2">
                                <SelectBasic
                                    colourOptions={colourOptions}
                                    changeHandler={changeHandler}
                                    blurHandler={blurHandler(value?.select?.value, form?.name)}
                                    errorMessage={errorMessage[form?.id]}
                                    placeholder={form?.placeHolder}
                                    value={value[form?.name]}
                                    name={form?.name}
                                />
                            </div>
                        )
                    }
                }
                )}


                <SwitchBasic
                    changeHandler={changeHandler}
                    value={value?.switch}
                    name="switch"
                />
                <CheckboxBasic
                    changeHandler={changeHandler}
                    name="checkBox"
                    value={value?.checkBox}
                />
            </ModalBody>
        </div>
    );
};
export default ModalForm;

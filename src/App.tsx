import { useState } from "react";
import { FormData } from "./formSettings";
import { Toaster, toast } from "react-hot-toast";
import { simulateAsyncOperation } from "./utils/helpers/request";
import { validation } from "./utils/helpers/validation";
import TooltipBasic from './components/TooltipBasic';
import TextArea from "./components/TextArea";
import RadioButton from "./components/RadioButton";
import Notify from "./components/Notify";
import ModalMain from "./components/ModalMain";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  select: { value: "", label: "" },
  switch: false,
  // textBox: "",
  // radio: false,
  checkBox: false,
};

// const form = {
//   'first': {
//     id: "1",
//     type: "text",
//   },
//   'second': {
//     id: "2",
//     type: "text",
//   },
// };

function App() {
  const [state, setState] = useState(initialState);
  const [arrState, setArrState] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [formModal, setFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validate, setValidate] = useState(false);

  const changeHandler = (name) => (e) => {
    //change handler for all reusable components
    const type = e?.target?.type || "";
    // console.log(e);
    const value =
      type === "checkbox" || type === "radio"
        ? e?.target?.checked
        : type === ""
        ? e
        : e?.target?.value;
    // console.log(value);
    setState({ ...state, [name]: value });
    // console.log(state);
    //console.log(e);
  };

  const handleToast = (type, message) => {
    toast[type](message);
  };
  const clickHandlerCancel = () => {
    setFormModal(!formModal);
  };
  const clickHandlerSubmit = async () => {
    setIsLoading(true);
    // setValidate();

    try {
      const message = await simulateAsyncOperation();
      setIsLoading(false);
      handleToast("success", message);
      setArrState([...arrState, state]);
      console.log(arrState);
      clickHandlerCancel(formModal, setFormModal);
    } catch (error) {
      setIsLoading(false);
      handleToast("error", error);
    }
  };
  const blurHandler = (value, name) => () => {
    // const { value, name } = e.target;
    // console.log("value", value, "name", name);
    const obj = FormData?.form?.find((data) => data.name === name);
    //console.log(obj);

    const test = !obj?.regex?.test(value);
    // console.log(test);
    if (obj?.required) {
      if (value === "" || value === undefined || test) {
        const updatedErrors = {
          ...errorMessage,
          [obj?.id]: obj?.errorMessage,
        };
        // console.log(updatedErrors);
        setErrorMessage(updatedErrors);
      } else {
        setErrorMessage({
          ...errorMessage,
          [obj?.id]: "",
        });
      }
    } else {
      setErrorMessage({
        ...errorMessage,
        [obj?.id]: "",
      });
    }
    // console.log(errorMessage);
  };

  return (
    <>
      {/* <Toaster position="top-right" /> */}
      <ModalMain
        changeHandler={changeHandler}
        errorMessage={errorMessage}
        blurHandler={blurHandler}
        value={state}
        formSetting={FormData.form}
        isLoading={isLoading}
        clickHandlerSubmit={clickHandlerSubmit}
        clickHandlerCancel={clickHandlerCancel}
        formModal={formModal}
        buttonDisabled={!validation(state, errorMessage, FormData.form)}
      />
      {/* <TextArea
        changeHandler={changeHandler}
        value={state.textBox}
        name="textBox"
      /> */}
      {/* <RadioButton
        changeHandler={changeHandler}
        name="radio"
        checked={state.radio}
      /> */}
      {/* <Notify type="success" message="this is error" /> */}
      {/* <TooltipBasic>this is tooltip</TooltipBasic> */}
    </>
  );
}

export default App

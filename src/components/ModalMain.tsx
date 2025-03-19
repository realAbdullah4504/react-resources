import { Button, Modal, ModalHeader } from "reactstrap";
import ModalFooterBasic from "./ModalFooterBasic";
import CommonModal from './CommonModal';


type Props = {
    changeHandler: (name: string) => (e: any) => void;
    errorMessage: any;
    blurHandler: (name: string) => (e: any) => void;
    value: any;
    formSetting: any;
    isLoading: boolean;
    clickHandlerSubmit: () => void;
    clickHandlerCancel: () => void;
    formModal: boolean;
    buttonDisabled: boolean;
};
const ModalMain = ({
    changeHandler,
    errorMessage,
    blurHandler,
    value,
    formSetting,
    isLoading,
    clickHandlerSubmit,
    clickHandlerCancel,
    formModal,
    buttonDisabled,
}:Props) => {

    return (
        <div className="demo-inline-spacing">
            {/* <Toaster position="top-right" /> */}

            <Button color="primary" outline onClick={clickHandlerCancel}>
                Login Form
            </Button>

            <Modal
                isOpen={formModal}
                toggle={clickHandlerCancel}
                className="modal-dialog-centered"
            >
                <ModalHeader toggle={clickHandlerCancel}>
                    Login Form
                </ModalHeader>

                <CommonModal
                    changeHandler={changeHandler}
                    errorMessage={errorMessage}
                    blurHandler={blurHandler}
                    value={value}
                    formSetting={formSetting}
                />

                <ModalFooterBasic
                    disabled={buttonDisabled}
                    clickHandlerCancel={clickHandlerCancel}
                    clickHandlerSubmit={clickHandlerSubmit}
                    isLoading={isLoading}
                />
            </Modal>

        </div>
    )

}

export default ModalMain;
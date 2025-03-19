import { ModalFooter, Button, Progress } from "reactstrap";
import ButtonBasic from "./ButtonBasic";
import ProgressBasic from './Loading';

const ModalFooterBasic = ({
    disabled = 'true',
    clickHandlerSubmit,
    clickHandlerCancel,
    isLoading }) => {
    return (
        <ModalFooter>
            {isLoading ? <ProgressBasic /> :
                <ButtonBasic
                    color="secondary"
                    disabled={disabled}
                    clickHandler={clickHandlerSubmit}>
                    Login
                </ButtonBasic>
            }{" "}
            <ButtonBasic
                color="secondary"
                clickHandler={clickHandlerCancel}
            >
                Cancel
            </ButtonBasic>
        </ModalFooter>
    );
}
export default ModalFooterBasic;
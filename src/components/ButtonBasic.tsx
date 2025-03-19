import { Button} from "reactstrap";

const ButtonBasic = ({
    // text = 'text',
    color = 'primary',
    size = '',
    clickHandler,
    disabled = false,
    children
}) => {
    return (
        <div>
            <Button
                disabled={disabled}
                onClick={clickHandler}
                color={color}
                size={size}>
                {children}
            </Button>
        </div>
    )
}
export default ButtonBasic;

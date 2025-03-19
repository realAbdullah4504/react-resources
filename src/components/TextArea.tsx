// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'

const TextArea = ({
  className = 'form-floating mt-2',
  type = 'textarea',
  name = 'text',
  value = '',
  id = 'floating-textarea',
  placeholder = 'Floating Label',
  changeHandler,
  blurHandler,
  rows = 4,

}) => {
  return (
    <div className={className}>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={changeHandler(name)}
        onBlur={blurHandler}
        id={id}
        placeholder={placeholder}
        rows={rows}
        style={{ minHeight: '100px' }}
      />
      
      <Label className='form-label' for={id}>
        Floating Label
      </Label>
    </div>
  )
}
export default TextArea

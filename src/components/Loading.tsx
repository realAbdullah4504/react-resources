// ** Reactstrap Imports
import { Button, Spinner } from 'reactstrap'

const ProgressBasic = ({
        color='primary'
    }
) => {
  return (
    <div className='me-4'>
        <Spinner color={color}/>
    </div>
  )
}
export default ProgressBasic
